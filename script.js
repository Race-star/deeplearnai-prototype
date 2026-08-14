// Smooth scrolling untuk navigasi
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

/* ================= MODAL POSTER LOGIC ================= */
const modal = document.getElementById("posterModal");
const btnPoster = document.getElementById("btnPoster");
const spanClose = document.getElementsByClassName("close-modal")[0];

if(btnPoster && modal) {
  btnPoster.onclick = function() {
    modal.style.display = "block";
  }
  spanClose.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

/* ================= NEURAL NETWORK CANVAS ================= */
const canvas = document.getElementById('neuralCanvas');
let ctx;
if (canvas) {
  ctx = canvas.getContext('2d');
  let W, H;

  function resizeCanvas(){
    const rect = canvas.getBoundingClientRect();
    W = canvas.width = rect.width * devicePixelRatio;
    H = canvas.height = rect.height * devicePixelRatio;
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  }
  window.addEventListener('resize', resizeCanvas);

  const layerCounts = [3,5,5,4];
  let nodes = [];
  let activePath = 0; 

  function buildNodes(){
    nodes = [];
    const w = canvas.getBoundingClientRect().width;
    const h = canvas.getBoundingClientRect().height;
    const layerGap = w / (layerCounts.length + 1);
    layerCounts.forEach((count, li) => {
      const colNodes = [];
      const gap = h / (count + 1);
      for(let i=0;i<count;i++){
        colNodes.push({ x: layerGap * (li+1), y: gap * (i+1), r: 4.5 });
      }
      nodes.push(colNodes);
    });
  }

  let pulseT = 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function draw(){
    const w = canvas.getBoundingClientRect().width;
    const h = canvas.getBoundingClientRect().height;
    ctx.clearRect(0,0,w,h);

    for(let li=0; li<nodes.length-1; li++){
      nodes[li].forEach((a, ai) => {
        nodes[li+1].forEach((b, bi) => {
          const isOutputStage = (li === nodes.length-2);
          const highlighted = isOutputStage && bi === activePath;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = highlighted ? 'rgba(245, 158, 11, 0.6)' : 'rgba(37, 99, 235, 0.15)';
          ctx.lineWidth = highlighted ? 1.6 : 0.8;
          ctx.stroke();
        });
      });
    }

    if(!reduceMotion){
      pulseT += 0.015;
      const p = (Math.sin(pulseT)+1)/2;
      for(let li=0; li<nodes.length-1; li++){
        const a = nodes[li][Math.min(activePath, nodes[li].length-1)];
        const b = nodes[li+1][Math.min(activePath, nodes[li+1].length-1)];
        const px = a.x + (b.x-a.x)*p;
        const py = a.y + (b.y-a.y)*p;
        ctx.beginPath();
        ctx.arc(px,py,2.6,0,Math.PI*2);
        ctx.fillStyle = '#F59E0B';
        ctx.fill();
      }
    }

    nodes.forEach((col, li) => {
      col.forEach((n, ni) => {
        const isOutputStage = (li === nodes.length-1);
        const highlighted = isOutputStage && ni === activePath;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fillStyle = highlighted ? '#F59E0B' : '#2563EB';
        ctx.globalAlpha = highlighted ? 1 : 0.75;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    });

    requestAnimationFrame(draw);
  }

  /* ================= STUDENT CHIP / PATH LOGIC ================= */
  const pathInfo = [
    { label: 'materi bergambar &amp; diagram', name: 'Tito' },
    { label: 'penjelasan audio &amp; rekaman suara', name: 'Adinda maulidya Zahrah' },
    { label: 'simulasi interaktif &amp; praktik langsung', name: 'Farhan' }
  ];

  document.querySelectorAll('#studentChips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#studentChips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activePath = parseInt(chip.dataset.path);
      const info = pathInfo[activePath];
      document.getElementById('pathLabel').innerHTML =
        `Jalur aktif: <b>${info.label}</b> untuk ${info.name}.`;
    });
  });

  window.addEventListener('load', () => {
    resizeCanvas();
    buildNodes();
    requestAnimationFrame(draw);
  });
}

/* ================= DEMO DASHBOARD ================= */
const studentData = [
  {
    name: 'Tito Ridho Irvansyah',
    scores: [58, 64, 70, 75, 82],
    rec: 'Latihan pecahan dengan diagram lingkaran interaktif, karena Tito menunjukkan pemahaman lebih cepat lewat visualisasi.',
    note: 'Catatan guru: pertimbangkan memberi tugas tambahan berupa infografis sederhana.',
    badgeIcon: '🎨',
    badgeText: 'Kreator Visual'
  },
  {
    name: 'Adinda maulidya Zahrah (Nadin)',
    scores: [45, 50, 55, 60, 68],
    rec: 'Materi audio penjelasan konsep pecahan, dilengkapi kuis lisan singkat untuk memperkuat retensi.',
    note: 'Catatan guru: Nadin merespons baik saat materi dibacakan ulang di kelas.',
    badgeIcon: '🎧',
    badgeText: 'Pendengar Kritis'
  },
  {
    name: 'Farhan Hidayat',
    scores: [62, 60, 68, 74, 80],
    rec: 'Simulasi potong-potong kue virtual untuk memahami pecahan lewat praktik langsung.',
    note: 'Catatan guru: Farhan lebih cepat paham lewat aktivitas fisik/manipulatif.',
    badgeIcon: '🛠️',
    badgeText: 'Eksplorator Aktif'
  }
];

const progressCanvas = document.getElementById('progressChart');
if(progressCanvas){
  const pctx = progressCanvas.getContext('2d');

  function drawChart(scores){
    const rect = progressCanvas.getBoundingClientRect();
    progressCanvas.width = rect.width * devicePixelRatio;
    progressCanvas.height = rect.height * devicePixelRatio;
    pctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
    const w = rect.width, h = rect.height;
    pctx.clearRect(0,0,w,h);

    const max = 100;
    const padding = 24;
    const stepX = (w - padding*2) / (scores.length - 1);

    pctx.strokeStyle = 'rgba(141,149,179,0.15)';
    pctx.lineWidth = 1;
    for(let i=0;i<=4;i++){
      const y = padding + (h-padding*2) * (i/4);
      pctx.beginPath();
      pctx.moveTo(padding, y);
      pctx.lineTo(w-padding, y);
      pctx.stroke();
    }

    pctx.beginPath();
    scores.forEach((s, i) => {
      const x = padding + stepX * i;
      const y = h - padding - ((s/max) * (h - padding*2));
      if(i===0) pctx.moveTo(x,y); else pctx.lineTo(x,y);
    });
    pctx.strokeStyle = '#2563EB'; 
    pctx.lineWidth = 2.2;
    pctx.stroke();

    pctx.lineTo(padding + stepX*(scores.length-1), h-padding);
    pctx.lineTo(padding, h-padding);
    pctx.closePath();
    pctx.fillStyle = 'rgba(37, 99, 235, 0.15)'; 
    pctx.fill();

    scores.forEach((s,i) => {
      const x = padding + stepX * i;
      const y = h - padding - ((s/max) * (h - padding*2));
      pctx.beginPath();
      pctx.arc(x,y,3.5,0,Math.PI*2);
      pctx.fillStyle = '#F59E0B'; 
      pctx.fill();
    });
  }

  function updateDashboard(idx){
    const d = studentData[idx];
    const recCard = document.getElementById('recCard');
    const guruNote = document.getElementById('guruNote');
    const badgeCard = document.getElementById('studentBadge');
    
    recCard.style.opacity = 0;
    guruNote.style.opacity = 0;
    badgeCard.style.opacity = 0;
    
    setTimeout(() => {
      drawChart(d.scores);
      recCard.innerHTML = `<p>${d.rec}</p>`;
      guruNote.textContent = d.note;
      document.getElementById('badgeIcon').textContent = d.badgeIcon;
      document.getElementById('badgeText').textContent = d.badgeText;
      
      recCard.style.opacity = 1;
      guruNote.style.opacity = 1;
      badgeCard.style.opacity = 1;
    }, 150);
  }

  document.getElementById('studentSelect').addEventListener('change', (e) => {
    updateDashboard(parseInt(e.target.value));
  });

  window.addEventListener('load', () => {
    updateDashboard(0);
  });
  window.addEventListener('resize', () => {
    updateDashboard(parseInt(document.getElementById('studentSelect').value));
  });
}

/* ================= TIM: TAMPILKAN FOTO & LINK IG SAAT DIKLIK ================= */
document.querySelectorAll('.member-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    // 1. Reset class aktif
    document.querySelectorAll('.member-chip').forEach(c => c.classList.remove('chip-active'));
    btn.classList.add('chip-active');

    // 2. Ambil elemen target
    const photoBox = document.getElementById('teamPhotoBox');
    const img = document.getElementById('teamPhotoImg');
    const igLink = document.getElementById('teamPhotoIg');
    const igText = document.getElementById('teamPhotoIgText');
    const nameText = document.getElementById('teamPhotoName');
    const nimText = document.getElementById('teamPhotoNim');
    
    // 3. Update konten (Cek terlebih dahulu elemennya ada agar tidak error)
    if(img) {
      img.src = btn.dataset.photo;
      img.alt = btn.dataset.name;
    }
    if(nameText) nameText.textContent = btn.dataset.name;
    if(nimText) nimText.textContent = 'NIM ' + btn.dataset.nim;
    
    // 4. Update link Instagram yang kebal error
    const igUsername = btn.dataset.ig;
    if(igUsername) {
      const urlIg = "https://www.instagram.com/" + igUsername;
      
      // Update tombol gradient IG
      if(igLink) igLink.href = urlIg;
      if(igText) igText.textContent = "@" + igUsername;

      // Jadikan gambar profil bisa diklik layaknya tombol
      if(img) {
        img.style.cursor = 'pointer';
        img.onclick = function() {
          window.open(urlIg, '_blank');
        };
      }
    }

    // 5. Tampilkan box
    if(photoBox) {
      photoBox.classList.add('visible');
    }
  });
});
