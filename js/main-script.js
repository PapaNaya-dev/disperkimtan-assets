// =========================================================
// MAIN SCRIPT DISPERKIMTAN (WAF SAFE BUILD)
// Konsolidasi seluruh Javascript, menggantikan inline-scripts
// dan menggunakan metode DOM aman (tanpa innerHTML raw).
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  
  // -----------------------------------------
  // 1. TOP NAVIGATION & HAMBURGER MENU
  // -----------------------------------------
  (function () {
    var ham = document.getElementById('dnavHam');
    var menu = document.getElementById('dnavMenu');
    if (ham && menu) {
      ham.addEventListener('click', function () {
        if (menu.classList.contains('dnav-open')) { menu.classList.remove('dnav-open'); } else { menu.classList.add('dnav-open'); }
      });
      var drops = menu.querySelectorAll('.dnav-has-drop > a');
      for (var i = 0; i < drops.length; i++) {
        drops[i].addEventListener('click', function (e) {
          if (window.innerWidth <= 920) {
            e.preventDefault();
            var p = this.parentNode;
            var all = menu.querySelectorAll('.dnav-has-drop');
            for (var j = 0; j < all.length; j++) { if (all[j] !== p) all[j].classList.remove('dnav-active'); }
            if (p.classList.contains('dnav-active')) { p.classList.remove('dnav-active'); } else { p.classList.add('dnav-active'); }
          }
        });
      }
    }
  })();

  // -----------------------------------------
  // 2. WELCOME POPUP (FASE 0)
  // -----------------------------------------
  (function () {
    var STORAGE_KEY = 'dpr_notice_dismissed';

    function shouldShow() {
      try {
        var val = localStorage.getItem(STORAGE_KEY);
        if (!val) return true;
        var dismissedAt = parseInt(val, 10);
        var now = Date.now();
        var ONE_DAY_MS = 24 * 60 * 60 * 1000;
        return (now - dismissedAt) > ONE_DAY_MS;
      } catch (e) { return true; }
    }

    function dprShow() {
      var popup = document.getElementById('dpr-welcome-popup');
      if (popup) {
        popup.classList.add('dpr-active');
        document.body.style.overflow = 'hidden';
      }
    }

    window.dprClosePopup = function () {
      var popup = document.getElementById('dpr-welcome-popup');
      var noShow = document.getElementById('dpr-no-show');
      var card = popup ? popup.querySelector('.dpr-popup-card') : null;

      if (card) {
        card.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease';
        card.style.transform = 'translateY(15px) scale(0.97)';
        card.style.opacity = '0';
      }

      setTimeout(function () {
        if (popup) {
          popup.classList.remove('dpr-active');
          document.body.style.overflow = '';
        }
        if (noShow && noShow.checked) {
          try { localStorage.setItem(STORAGE_KEY, Date.now().toString()); } catch (e) { }
        } else {
          try { sessionStorage.setItem(STORAGE_KEY + '_session', '1'); } catch (e) { }
        }
      }, 300);
    };

    function isSessionDismissed() {
      try { return !!sessionStorage.getItem(STORAGE_KEY + '_session'); } catch (e) { return false; }
    }

    var popup = document.getElementById('dpr-welcome-popup');
    if (popup) {
      if (shouldShow() && !isSessionDismissed()) {
        setTimeout(dprShow, 600);
      }
      var backdrop = popup.querySelector('.dpr-popup-backdrop');
      if (backdrop) backdrop.addEventListener('click', window.dprClosePopup);
      var closeBtn = document.getElementById('dpr-popup-close-btn');
      if (closeBtn) closeBtn.addEventListener('click', window.dprClosePopup);
    }
  })();

  // -----------------------------------------
  // 3. SLIDER BANNER (FASE 1)
  // -----------------------------------------
  (function () {
    const slides = document.querySelectorAll("#banner-disperkimtan .banner-slide");
    const dotsContainer = document.querySelector("#banner-disperkimtan .dots");
    const prevBtn = document.querySelector("#banner-disperkimtan .prev");
    const nextBtn = document.querySelector("#banner-disperkimtan .next");

    if (!slides.length || !dotsContainer) return;

    let index = 0;
    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.onclick = () => showSlide(i);
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".dot");

    function showSlide(i) {
      slides[index].classList.remove("active");
      dots[index].classList.remove("active");
      index = (i + slides.length) % slides.length;
      slides[index].classList.add("active");
      dots[index].classList.add("active");
    }

    if (prevBtn) prevBtn.addEventListener("click", () => showSlide(index - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => showSlide(index + 1));

    let autoSlide = setInterval(() => showSlide(index + 1), 5000);
    const banner = document.getElementById("banner-disperkimtan");
    if (banner) {
      banner.addEventListener("mouseenter", () => clearInterval(autoSlide));
      banner.addEventListener("mouseleave", () => autoSlide = setInterval(() => showSlide(index + 1), 5000));
    }
  })();

  // -----------------------------------------
  // 4. LAYANAN & MODAL POPUP (FASE 2)
  // -----------------------------------------
  const layanan = {
    rtlh: {
      judul: "LAYANAN BANTUAN RTLH",
      persyaratan: ["Fotokopi KTP dan Kartu Keluarga (KK) Kota Palangka Raya.", "Surat Keterangan Tidak Mampu (SKTM) dari Kelurahan.", "Bukti Kepemilikan Tanah yang sah (Sertifikat/SKT/Segel).", "Foto kondisi rumah saat ini (Depan, Samping, Belakang, Dalam)."],
      prosedur: ["Pemohon menyerahkan proposal/berkas persyaratan ke Dinas.", "Tim Teknis Disperkimtan melakukan verifikasi administrasi.", "Tim Teknis melakukan survey lapangan ke lokasi rumah.", "Penetapan penerima bantuan melalui SK Walikota.", "Penyaluran bantuan dan pelaksanaan rehabilitasi."],
      waktu: "Sesuai Jadwal Anggaran",
      biaya: "GRATIS"
    },
    swari: {
      judul: "LAYANAN SWARI",
      persyaratan: ["Terdaftar dalam Data Terpadu Kesejahteraan Sosial (DTKS).", "Surat Permohonan Bantuan Sosial.", "Fotokopi KTP dan KK.", "Dokumen pendukung lainnya sesuai jenis bantuan (SPAM/SPALD)."],
      prosedur: ["Pengajuan usulan melalui sistem SWARI atau loket pelayanan.", "Verifikasi data dan lapangan oleh tim teknis.", "Validasi kelayakan penerima bantuan.", "Pelaksanaan distribusi bantuan fisik/pembangunan."],
      waktu: "Tentatif (Sesuai Antrean)",
      biaya: "GRATIS"
    },
    simantan: {
      judul: "LAYANAN SIMANTAN",
      persyaratan: ["Surat Permintaan Informasi Aset (bagi instansi).", "Tanda pengenal pegawai/pemohon.", "Keterangan lokasi/titik koordinat aset yang ditanyakan."],
      prosedur: ["Pemohon membuka portal WebGIS SIMANTAN.", "Atau mengajukan permohonan data ke Bidang Pertanahan.", "Pengecekan kesesuaian koordinat dengan database aset.", "Pemberian informasi status aset tanah Pemerintah Kota."],
      waktu: "1 Hari Kerja",
      biaya: "GRATIS"
    },
    rusun: {
      judul: "PELAYANAN HUNIAN RUSUNAWA", isPublik: true, downloadFormUrl: "#", pengaduanUrl: "#",
      persyaratan: ["Fotocopy Kartu Tanda Penduduk (KTP) pemohon yang masih berlaku (2 lembar).", "Fotocopy Kartu Keluarga (KK) (2 lembar).", "Fotocopy Surat Nikah (Jika sudah menikah).", "Pas Foto berwarna terbaru berukuran 4x6 (2 lembar).", "Surat Keterangan Penghasilan (Formulir Tersedia).", "Surat Permohonan Penghunian Rusunawa (Formulir Tersedia).", "Surat Pernyataan Mematuhi Ketentuan Rusunawa (Formulir Tersedia)."],
      prosedur: ["Pemohon menyerahkan berkas persyaratan kepada petugas.", "Petugas melakukan verifikasi berkas pemohon.", "Pembuatan dokumen perjanjian sewa rusunawa.", "Penyelesaian administrasi pembayaran dan penandatanganan dokumen.", "Pelaksanaan serah terima kunci kamar hunian."],
      waktu: "5 Hari Kerja", biaya: "Sesuai Tarif Sewa / Retribusi"
    },
    tpu: {
      judul: "PELAYANAN PEMAKAMAN", isPublik: true, downloadFormUrl: "#", pengaduanUrl: "#",
      persyaratan: ["Surat Permohonan dari Ahli Waris/Pemohon.", "Surat Keterangan Tidak Mampu dari RT/RW (untuk keluarga tidak mampu).", "Surat Keterangan Kejadian dari Kepolisian (untuk mayat terlantar/tidak dikenal).", "Surat Keterangan Kematian/Visum dari Rumah Sakit atau Kelurahan."],
      prosedur: ["Menyampaikan permohonan dan menyerahkan kelengkapan berkas.", "Dinas melakukan koordinasi dengan Yayasan Pengelola Pemakaman.", "Pelaksanaan koordinasi dan survei lapangan.", "Pelaksanaan kegiatan pemakaman dan/atau pengabuan jenazah/mayat.", "Pemrosesan permohonan dan penyerahan bantuan dana ke Yayasan."],
      waktu: "5 Hari Kerja", biaya: "GRATIS"
    },
    siteplan: {
      judul: "PENGESAHAN SITE PLAN PERUMAHAN", isPublik: true, downloadFormUrl: "#", pengaduanUrl: "#",
      persyaratan: ["Surat Permohonan Pengesahan Site Plan.", "Fotokopi KTP Pemohon/Penanggung Jawab dan Kelengkapan Izin Usaha/NIB.", "Fotokopi Bukti Kepemilikan Hak Atas Tanah (Sertifikat Hak Milik/HGB).", "Surat Keterangan Rencana Kota (SKRK) / KKPR dari dinas terkait.", "Rekomendasi Peil Banjir (PUPR) dan Dokumen Pengelolaan Lingkungan.", "Surat Pernyataan Kesediaan Penyerahan PSU (Bermaterai).", "Bukti Lunas PBB Tahun Berjalan.", "File Gambar Rencana format CAD/DWG dan hardcopy A3."],
      prosedur: ["Pemohon mengajukan berkas melalui Loket Layanan / Sistem Terpadu.", "Verifikasi administrasi dan penelaahan kesesuaian tata ruang (RTRW/RDTR).", "Survei/pemeriksaan lapangan oleh Tim Teknis bersama Pemohon.", "Rapat Verifikasi dan perbaikan gambar teknis (jika ada revisi).", "Penerbitan Dokumen Pertimbangan Teknis (Pertek) Pengesahan Site Plan."],
      waktu: "7 - 10 Hari Kerja", biaya: "GRATIS"
    },
    psu: {
      judul: "PSU PERUMAHAN",
      persyaratan: ["Surat Permohonan Penyerahan PSU dari Pengembang/Warga.", "Fotokopi Siteplan yang telah disahkan.", "Sertifikat Induk dan/atau sertifikat pecahan PSU.", "Berita Acara hasil pemeriksaan fisik lapangan."],
      prosedur: ["Pengajuan permohonan penyerahan PSU ke Disperkimtan.", "Tim Verifikasi melakukan peninjauan fisik di lapangan.", "Perbaikan fisik oleh pengembang (jika ada kekurangan).", "Penandatanganan Berita Acara Serah Terima (BAST).", "Pencatatan PSU sebagai aset Pemerintah Daerah."],
      waktu: "30 Hari Kerja", biaya: "GRATIS"
    }
  };

  // Safe DOM string insertion builder helper
  function createElement(tag, className, content) {
    const el = document.createElement(tag);
    if(className) el.className = className;
    if(content) el.textContent = content;
    return el;
  }

  window.openLayananModal = function(jenis) {
    let data = layanan[jenis];
    if (!data) return;
    
    const popupContent = document.getElementById("popupContent");
    popupContent.innerHTML = ''; // bersihkan

    // Judul
    popupContent.appendChild(createElement("div", "popup-title", data.judul));

    // Persyaratan
    const sectionSyarat = createElement("div", "popup-section");
    const h3Syarat = createElement("h3");
    const bSyarat = createElement("b", "", "📄 Persyaratan Dokumen");
    h3Syarat.appendChild(bSyarat);
    sectionSyarat.appendChild(h3Syarat);
    const ulSyarat = createElement("ul");
    data.persyaratan.forEach(syarat => {
      ulSyarat.appendChild(createElement("li", "", syarat));
    });
    sectionSyarat.appendChild(ulSyarat);
    popupContent.appendChild(sectionSyarat);

    // Prosedur
    const sectionProsedur = createElement("div", "popup-section");
    const h3Prosedur = createElement("h3");
    const bProsedur = createElement("b", "", "⚙️ Prosedur Pelayanan");
    h3Prosedur.appendChild(bProsedur);
    sectionProsedur.appendChild(h3Prosedur);
    const ulProsedur = createElement("ul");
    data.prosedur.forEach(pro => {
      ulProsedur.appendChild(createElement("li", "", pro));
    });
    sectionProsedur.appendChild(ulProsedur);
    popupContent.appendChild(sectionProsedur);

    // Info Waktu & Biaya
    const sectionInfo = createElement("div", "popup-section");
    const h3Info = createElement("h3");
    const bInfo = createElement("b", "", "ℹ️ Informasi Layanan");
    h3Info.appendChild(bInfo);
    sectionInfo.appendChild(h3Info);
    
    const popupInfoDiv = createElement("div", "popup-info");
    const boxWaktu = createElement("div", "popup-box");
    boxWaktu.appendChild(createElement("small", "", "⏳ Waktu Pelayanan"));
    boxWaktu.appendChild(createElement("span", "", data.waktu));
    popupInfoDiv.appendChild(boxWaktu);

    const boxBiaya = createElement("div", "popup-box");
    boxBiaya.style.alignItems = "center";
    boxBiaya.style.textAlign = "center";
    boxBiaya.appendChild(createElement("small", "", "💰 Biaya / Tarif"));
    const spanBiaya = createElement("span", "", data.biaya);
    spanBiaya.style.background = "#e8f8f1";
    spanBiaya.style.color = "#27ae60";
    spanBiaya.style.padding = "5px 12px";
    spanBiaya.style.borderRadius = "8px";
    spanBiaya.style.fontWeight = "700";
    boxBiaya.appendChild(spanBiaya);
    popupInfoDiv.appendChild(boxBiaya);

    sectionInfo.appendChild(popupInfoDiv);
    popupContent.appendChild(sectionInfo);

    // Action Section (Aksi Terkait)
    if(data.isPublik) {
      // Create HTML safely using DocumentFragment or building nodes
      const actionSection = createElement("div", "popup-section popup-actions-section");
      const h3Action = createElement("h3");
      const bAction = createElement("b", "", "⚡ Aksi & Layanan Terkait");
      h3Action.appendChild(bAction);
      actionSection.appendChild(h3Action);

      const actionGrid = createElement("div", "popup-actions-grid");

      // Tombol download
      const btnUnduh = createElement("a", "popup-action-btn popup-btn-download");
      btnUnduh.href = data.downloadFormUrl || "#";
      btnUnduh.target = "_blank";
      if (!data.downloadFormUrl || data.downloadFormUrl === "#") {
        btnUnduh.addEventListener('click', (e) => {
          e.preventDefault();
          alert('Formulir resmi sedang dipersiapkan dan akan segera dapat diunduh.');
        });
      }
      btnUnduh.appendChild(createElement("span", "btn-ico", "📥"));
      const twUnduh = createElement("div", "btn-text-wrap");
      twUnduh.appendChild(createElement("span", "btn-title", "Unduh Formulir"));
      twUnduh.appendChild(createElement("span", "btn-sub", "Template permohonan & surat pernyataan"));
      btnUnduh.appendChild(twUnduh);
      actionGrid.appendChild(btnUnduh);

      // Tombol Pengaduan
      const btnAdu = createElement("a", "popup-action-btn popup-btn-pengaduan");
      btnAdu.href = data.pengaduanUrl || "#";
      btnAdu.target = "_blank";
      if (!data.pengaduanUrl || data.pengaduanUrl === "#") {
        btnAdu.addEventListener('click', (e) => {
          e.preventDefault();
          alert('Layanan pengaduan sedang dipersiapkan.');
        });
      }
      btnAdu.appendChild(createElement("span", "btn-ico", "📢"));
      const twAdu = createElement("div", "btn-text-wrap");
      twAdu.appendChild(createElement("span", "btn-title", "Pengaduan Layanan"));
      twAdu.appendChild(createElement("span", "btn-sub", "Sampaikan kendala, kritik & saran"));
      btnAdu.appendChild(twAdu);
      actionGrid.appendChild(btnAdu);

      actionSection.appendChild(actionGrid);
      popupContent.appendChild(actionSection);
    }

    document.getElementById("popupBox").style.display = "block";
  };

  window.closeLayananModal = function() {
    document.getElementById("popupBox").style.display = "none";
  };

  // Event listener untuk tombol layanan (menggantikan onclick html attribute)
  document.querySelectorAll('[data-action="open-modal"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('data-target');
      if(target) openLayananModal(target);
    });
  });

  // Listener tombol close popup
  const closeBtnPopup = document.querySelector('.popup-close');
  if(closeBtnPopup) closeBtnPopup.addEventListener('click', window.closeLayananModal);

  window.addEventListener('click', function (e) {
    if (e.target == document.getElementById("popupBox")) {
      window.closeLayananModal();
    }
  });


  // -----------------------------------------
  // 5. LIVE CLOCK & COUNTERS (FASE 3)
  // -----------------------------------------
  (function() {
    function updateClock() {
      const now = new Date();
      const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const dateStr = now.toLocaleDateString('id-ID', optionsDate);
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}:${seconds}`;

      const elDate = document.getElementById('liveDate');
      const elTime = document.getElementById('liveTime');
      if (elDate) elDate.textContent = dateStr;
      if (elTime) elTime.textContent = timeStr;

      const day = now.getDay(); 
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = currentHour + (currentMinute / 60);

      let isOpen = false;
      if (day >= 1 && day <= 4) { if (currentTime >= 8.0 && currentTime < 15.5) isOpen = true; }
      else if (day === 5) { if (currentTime >= 8.0 && currentTime < 14.5) isOpen = true; }

      const statusEl = document.getElementById('officeStatus');
      if (statusEl) {
        if (isOpen) {
          statusEl.textContent = '🟢 STATUS: BUKA';
          statusEl.className = 'office-status status-open';
        } else {
          statusEl.textContent = '🔴 STATUS: TUTUP';
          statusEl.className = 'office-status status-closed';
        }
      }
    }

    if(document.getElementById('liveTime')) {
      setInterval(updateClock, 1000);
      updateClock(); 
    }

    const counters = document.querySelectorAll('.counter-number');
    const speed = 200; 
    const animateCounters = () => {
      counters.forEach(counter => {
        const updateCount = () => {
          const target = +counter.getAttribute('data-target');
          const count = +counter.innerText;
          const inc = target / speed;
          if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(updateCount, 15);
          } else {
            counter.innerText = target;
          }
        };
        updateCount();
      });
    };

    let animated = false;
    window.addEventListener('scroll', () => {
      if (!animated && counters.length > 0) {
        const statsContainer = document.querySelector('.disperkimtan-stats-container');
        if (statsContainer) {
          const sectionPos = statsContainer.getBoundingClientRect().top;
          const screenPos = window.innerHeight;
          if (sectionPos < screenPos) {
            animateCounters();
            animated = true;
          }
        }
      }
    });
  })();


  // -----------------------------------------
  // 6. MAP SVG TOOLTIPS (FASE 4)
  // -----------------------------------------
  (function() {
    const mapDataArea = {
      "rakumpit": { name: "Kecamatan Rakumpit", aset: 45, siteplan: 12 },
      "bukitbatu": { name: "Kecamatan Bukit Batu", aset: 120, siteplan: 34 },
      "jekanraya": { name: "Kecamatan Jekan Raya", aset: 850, siteplan: 215 },
      "pahandut": { name: "Kecamatan Pahandut", aset: 430, siteplan: 89 },
      "sabangau": { name: "Kecamatan Sabangau", aset: 210, siteplan: 45 }
    };

    const tooltip = document.getElementById("map-tooltip");
    const tooltipTitle = document.getElementById("tooltip-title");
    const tooltipAset = document.getElementById("tooltip-aset");
    const tooltipSiteplan = document.getElementById("tooltip-siteplan");

    const mapAreas = document.querySelectorAll("#map-districts polygon, #map-districts path");
    const mapContainer = document.querySelector(".disperkimtan-map-container");

    if (mapAreas.length > 0 && tooltip && mapContainer) {
      mapAreas.forEach(area => {
        area.addEventListener("mouseenter", function (e) {
          const areaId = this.getAttribute("id");
          if (mapDataArea[areaId]) {
            tooltipTitle.textContent = mapDataArea[areaId].name;
            tooltipAset.textContent = mapDataArea[areaId].aset + " Titik";
            tooltipSiteplan.textContent = mapDataArea[areaId].siteplan + " Berkas";
            tooltip.classList.add("visible");
          }
        });
        area.addEventListener("mousemove", function (e) {
          const containerRect = mapContainer.getBoundingClientRect();
          const x = e.clientX - containerRect.left;
          const y = e.clientY - containerRect.top;
          tooltip.style.left = x + "px";
          tooltip.style.top = y + "px";
        });
        area.addEventListener("mouseleave", function () {
          tooltip.classList.remove("visible");
        });
      });
    }

    // WEBGIS STATS FETCH WAF SAFE (Ganti DOM Injection manual tanpa eval/innerHTML)
    if(document.getElementById('side-stat-visits')){
      fetch('https://palangkaraya.go.id/wp-json/opda-public/v1/stats?blog=34&days=30')
        .then(r => r.ok ? r.json() : Promise.reject(r))
        .then(d => {
          if (d.kpis) {
            var nf = new Intl.NumberFormat('id-ID');
            document.getElementById('side-stat-visits').textContent = nf.format(d.kpis.visits);
            document.getElementById('side-stat-uniques').textContent = nf.format(d.kpis.uniques);
            document.getElementById('side-stat-pageviews').textContent = nf.format(d.kpis.pageviews);
          }
        })
        .catch(e => console.error('Gagal memuat statistik:', e));
    }
  })();

  // -----------------------------------------
  // 7. PPID WIDGET WAF SAFE (FASE 4 & 8)
  // -----------------------------------------
  (async function() {
    const ppidContainer = document.getElementById("ppid-widget-list") || document.getElementById("ppid-sidebar-list");
    if(!ppidContainer) return; // Tidak ada container PPID

    // Cek apakah mode sidebar atau widget (Fase 8)
    const isSidebar = ppidContainer.id === "ppid-sidebar-list";
    const MAX_ITEMS = isSidebar ? 5 : 6;
    const FILTER_OPD = isSidebar ? "Dinas Perumahan" : "Dinas Perumahan Rakyat dan Kawasan Pemukiman";

    const API_URLS = [
      "https://appscript.palangkaraya.go.id/sertamerta.json",
      "https://appscript.palangkaraya.go.id/berkala.json",
      "https://appscript.palangkaraya.go.id/setiapsaat.json"
    ];

    function parseIndoDate(dateStr) {
      if (!dateStr) return 0;
      const parts = dateStr.trim().split(" ");
      if (parts.length < 3) return 0;
      const d = parseInt(parts[0], 10);
      const mStr = parts[1].toLowerCase();
      const y = parseInt(parts[2], 10);
      const months = { "januari": 0, "februari": 1, "maret": 2, "april": 3, "mei": 4, "juni": 5, "juli": 6, "agustus": 7, "september": 8, "oktober": 9, "november": 10, "nopember": 10, "desember": 11 };
      return new Date(y, months[mStr] || 0, d).getTime();
    }

    try {
      const responses = await Promise.all(API_URLS.map(url => fetch(url + '?v=' + new Date().getTime())));
      let allDocs = [];
      for (const res of responses) {
        if (res.ok) {
          const json = await res.json();
          if (json.data) allDocs = allDocs.concat(json.data);
        }
      }

      const filteredDocs = allDocs
        .filter(d => (d["OPD"] || "").toLowerCase().includes(FILTER_OPD.toLowerCase()))
        .map(d => ({
          judul: d["Judul"] || "Tanpa Judul",
          kategori: d["Kategori"] || "Informasi",
          link: d["URL"] || d["Tampilkan"] || "#",
          tanggal: d["Tanggal"] || "—",
          timestamp: parseIndoDate(d["Tanggal"])
        }))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, MAX_ITEMS);

      ppidContainer.innerHTML = ''; // Bersihkan loader, kita tidak pakai append karena ini pertama kali
      
      if (filteredDocs.length === 0) {
        const div = document.createElement("div");
        div.style.padding = "30px"; div.style.textAlign = "center"; div.style.color = "#6b7a99";
        div.style.gridColumn = "1 / -1"; div.style.background = "#ffffff";
        div.style.borderRadius = "14px"; div.style.border = "1px solid #dce3ef";
        div.textContent = "Belum ada dokumen yang tersedia untuk instansi ini.";
        ppidContainer.appendChild(div);
        return;
      }

      // WAF SAFE DOM BUILDING
      filteredDocs.forEach(doc => {
        const itemClass = isSidebar ? "ppid-sidebar-item" : "ppid-item";
        const a = document.createElement('a');
        a.href = doc.link;
        a.target = "_blank";
        a.rel = "noopener";
        a.className = itemClass;

        const iconDiv = document.createElement('div');
        iconDiv.className = isSidebar ? "ppid-sidebar-icon" : "ppid-icon";
        iconDiv.textContent = "📄";
        a.appendChild(iconDiv);

        const contentDiv = document.createElement('div');
        contentDiv.className = isSidebar ? "ppid-sidebar-content" : "ppid-content";

        const titleDiv = document.createElement('div');
        titleDiv.className = isSidebar ? "ppid-sidebar-doc-title" : "ppid-doc-title";
        titleDiv.textContent = doc.judul;
        contentDiv.appendChild(titleDiv);

        const metaDiv = document.createElement('div');
        metaDiv.className = isSidebar ? "ppid-sidebar-meta" : "ppid-meta";
        
        const badgeSpan = document.createElement('span');
        badgeSpan.className = isSidebar ? "ppid-sidebar-badge" : "ppid-badge";
        badgeSpan.textContent = doc.kategori;
        metaDiv.appendChild(badgeSpan);

        const dateSpan = document.createElement('span');
        if(!isSidebar) {
           dateSpan.className = "ppid-date";
           // Menambah SVG manual pakai DOMParser lebih aman atau tidak perlu SVG agar simple
           dateSpan.textContent = " " + doc.tanggal;
        } else {
           dateSpan.textContent = doc.tanggal;
        }
        metaDiv.appendChild(dateSpan);

        contentDiv.appendChild(metaDiv);
        a.appendChild(contentDiv);
        ppidContainer.appendChild(a);
      });

    } catch(e) {
      console.error("PPID Widget Error:", e);
      ppidContainer.innerHTML = '';
      const errDiv = document.createElement('div');
      errDiv.style.padding = "30px"; errDiv.style.textAlign = "center"; errDiv.style.color = "#ef4444";
      errDiv.textContent = "Gagal memuat dokumen PPID. Periksa koneksi internet Anda.";
      ppidContainer.appendChild(errDiv);
    }
  })();


  // -----------------------------------------
  // 8. SLIDER BERITA WAF SAFE (FASE 7)
  // -----------------------------------------
  (function() {
    const track = document.getElementById('beritaTrack');
    if(!track) return;

    const API_URL = window.location.origin + '/wp-json/wp/v2/posts?per_page=9&_embed=1';

    fetch(API_URL)
      .then(res => res.json())
      .then(posts => {
        renderBerita(posts);
      })
      .catch(err => {
        track.innerHTML = '';
        const errDiv = document.createElement('div');
        errDiv.style.padding = "20px"; errDiv.style.color = "#64748b"; errDiv.style.textAlign = "center"; errDiv.style.width = "100%";
        errDiv.textContent = "⚠️ Gagal memuat berita. Pastikan berjalan di lingkungan domain utama.";
        track.appendChild(errDiv);
      });

    function renderBerita(posts) {
      const dotsContainer = document.getElementById('beritaDots');
      track.innerHTML = ''; 

      if (!posts || posts.length === 0) {
        const msg = document.createElement('div');
        msg.style.padding = "20px"; msg.style.color = "#64748b";
        msg.textContent = "Belum ada postingan.";
        track.appendChild(msg);
        return;
      }

      posts.forEach(post => {
        let hasImage = false;
        let imageUrl = '';
        try {
          imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
          if (imageUrl) hasImage = true;
        } catch (e) { hasImage = false; }

        const konten = post.content ? post.content.rendered : '';
        const hasVideo = /youtube.com|youtu.be|vimeo.com|<video|<iframe[^>]*src=["'][^"']*video/i.test(konten);

        let excerptTeks = '';
        try {
          const tmpDiv = document.createElement('div');
          tmpDiv.innerHTML = post.excerpt.rendered; // Temporary in-memory for extraction
          excerptTeks = tmpDiv.textContent.trim().substring(0, 120) + '...';
        } catch (e) { excerptTeks = 'Klik untuk membaca selengkapnya...'; }

        let kategoriLabel = 'Berita Terbaru';
        const card = document.createElement('a');
        card.href = post.link;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.className = 'berita-card';

        // Thumb building
        if (hasImage) {
          const img = document.createElement('img');
          img.className = 'berita-card-thumb';
          img.src = imageUrl;
          img.loading = 'lazy';
          img.alt = '';
          // We remove the onerror innerHTML execution to be WAF Safe.
          // Fallback handled via CSS or we can use error listener instead.
          img.addEventListener('error', function() {
             this.replaceWith(createTextFallback(excerptTeks));
          });
          card.appendChild(img);
        } else if (hasVideo) {
          kategoriLabel = '🎬 Konten Video';
          const vidDiv = document.createElement('div');
          vidDiv.className = 'berita-card-thumb-video';
          const playIco = document.createElement('div');
          playIco.className = 'play-icon';
          playIco.textContent = '▶';
          const playLbl = document.createElement('div');
          playLbl.className = 'play-label';
          playLbl.textContent = 'Tonton Video';
          vidDiv.appendChild(playIco);
          vidDiv.appendChild(playLbl);
          card.appendChild(vidDiv);
        } else {
          card.appendChild(createTextFallback(excerptTeks));
        }

        function createTextFallback(text) {
          const txtDiv = document.createElement('div');
          txtDiv.className = 'berita-card-thumb-text';
          const txtIco = document.createElement('div');
          txtIco.className = 'teks-icon';
          txtIco.textContent = '📰';
          const txtExc = document.createElement('div');
          txtExc.className = 'teks-excerpt';
          txtExc.textContent = text;
          txtDiv.appendChild(txtIco);
          txtDiv.appendChild(txtExc);
          return txtDiv;
        }

        const tgl = new Date(post.date);
        const opsiTgl = { day: 'numeric', month: 'long', year: 'numeric' };
        const tglStr = tgl.toLocaleDateString('id-ID', opsiTgl);

        // Sanitize judul from HTML entities safe way
        const tempTitle = document.createElement('div');
        tempTitle.innerHTML = post.title.rendered;
        const judul = tempTitle.textContent;

        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'berita-card-body';
        
        const katDiv = document.createElement('div');
        katDiv.className = 'berita-card-kategori';
        katDiv.textContent = kategoriLabel;
        bodyDiv.appendChild(katDiv);

        const judDiv = document.createElement('div');
        judDiv.className = 'berita-card-judul';
        judDiv.textContent = judul;
        bodyDiv.appendChild(judDiv);

        const tglDiv = document.createElement('div');
        tglDiv.className = 'berita-card-tanggal';
        tglDiv.textContent = tglStr;
        bodyDiv.appendChild(tglDiv);

        card.appendChild(bodyDiv);
        track.appendChild(card);
      });

      initSlider(posts.length);
    }

    function initSlider(totalCards) {
      const track = document.getElementById('beritaTrack');
      const dotsContainer = document.getElementById('beritaDots');
      const prevBtn = document.getElementById('beritaPrev');
      const nextBtn = document.getElementById('beritaNext');

      const cardsPerView = window.innerWidth <= 768 ? 1 : 3;
      const totalSlides = Math.ceil(totalCards / cardsPerView);
      let currentSlide = 0;

      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'berita-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
      }

      function goToSlide(index) {
        currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
        const firstCard = track.querySelector('.berita-card');
        const cardWidth = firstCard ? firstCard.offsetWidth : 0;
        const gap = 20;
        const offset = currentSlide * cardsPerView * (cardWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;

        document.querySelectorAll('.berita-dot').forEach((d, i) => {
          d.classList.toggle('active', i === currentSlide);
        });
      }

      if(prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
      if(nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

      let autoPlay = setInterval(() => {
        goToSlide(currentSlide + 1 >= totalSlides ? 0 : currentSlide + 1);
      }, 6000);

      track.addEventListener('mouseenter', () => clearInterval(autoPlay));
      track.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => {
          goToSlide(currentSlide + 1 >= totalSlides ? 0 : currentSlide + 1);
        }, 6000);
      });
    }
  })();

  // -----------------------------------------
  // 9. CHART REALISASI FISIK WAF SAFE (FASE 9)
  // -----------------------------------------
  (function() {
    const canvas = document.getElementById("realisasiChart") || document.getElementById("realisasiChartInline");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const gradientFisik = ctx.createLinearGradient(0, 0, 0, 400);
    gradientFisik.addColorStop(0, "rgba(16, 185, 129, .20)");
    gradientFisik.addColorStop(1, "rgba(16, 185, 129, 0)");

    const gradientKeuangan = ctx.createLinearGradient(0, 0, 0, 400);
    gradientKeuangan.addColorStop(0, "rgba(59, 130, 246, .20)");
    gradientKeuangan.addColorStop(1, "rgba(59, 130, 246, 0)");

    const labels = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const dataFisik = [0.48, 1.92, 8.18, 27.43, 27.43, 43.05, null, null, null, null, null, null];
    const dataKeuangan = [0.48, 1.92, 8.17, 11.91, 11.91, 33.34, null, null, null, null, null, null];

    let lastIndex = dataFisik.length - 1;
    while (lastIndex >= 0 && dataFisik[lastIndex] === null) {
        lastIndex--;
    }

    // Tunggu sampai Chart.js diload dari script tag
    function initChart() {
      if(typeof Chart === 'undefined') {
        setTimeout(initChart, 500);
        return;
      }
      new Chart(ctx, {
          type: "line",
          data: {
              labels: labels,
              datasets: [
              {
                  label: "Realisasi Fisik (%)",
                  data: dataFisik,
                  borderColor: "#10b981",
                  backgroundColor: gradientFisik,
                  fill: true,
                  tension: 0.35,
                  borderWidth: 3,
                  pointRadius: (c) => c.dataIndex === lastIndex ? 6 : 4,
                  pointBackgroundColor: "#fff",
                  pointBorderColor: "#10b981",
                  pointBorderWidth: 2
              },
              {
                  label: "Realisasi Keuangan (%)",
                  data: dataKeuangan,
                  borderColor: "#3b82f6",
                  backgroundColor: gradientKeuangan,
                  fill: true,
                  tension: 0.35,
                  borderWidth: 3,
                  pointRadius: 4,
                  pointBackgroundColor: "#fff",
                  pointBorderColor: "#3b82f6",
                  pointBorderWidth: 2
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: { mode: 'index', intersect: false },
              plugins: {
                  legend: { position: 'top', labels: { font: { family: "'Segoe UI', Arial, sans-serif", size: 13, weight: '600' }, color: '#334155' } },
                  tooltip: { callbacks: { label: (ctx) => ctx.dataset.label + " : " + ctx.raw + " %" } }
              },
              scales: { y: { beginAtZero: true, max: 100, ticks: { callback: (v) => v + " %" } } },
              animation: {
                  onComplete: function() {
                      const meta = this.getDatasetMeta(0);
                      const point = meta.data[lastIndex];
                      if(point) {
                          const blink = document.getElementById("blinkPoint");
                          const label = document.getElementById("pointLabel");
                          if(blink && label) {
                            blink.style.left = point.x + "px";
                            blink.style.top = point.y + "px";
                            label.style.left = point.x + "px";
                            label.style.top = point.y + "px";
                            label.innerHTML = dataFisik[lastIndex] + " %";
                          }
                      }
                  }
              }
          }
      });
    }
    initChart();
  })();

});
