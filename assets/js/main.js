/* 王文畅 · 风景园林作品集 — 交互脚本 */
(function () {
  'use strict';

  /* ── 作品数据（图纸编号对应 assets/img/works/wXX.jpg） ── */
  var PROJECTS = [
    {
      title: '人间烟火气',
      sub: '智慧乡村活化设计',
      pages: [4, 5, 6, 7],
      notes: ['总平面与设计说明', '前期分析', '产业与生态策略', '非遗唤醒与特色活动']
    },
    {
      title: '城市“多巴胺”',
      sub: '“城市客厅”理念下的公园景观设计',
      pages: [8, 9, 10, 11],
      notes: ['整体鸟瞰与设计说明', '前期与文脉分析', '策略深化与绿色氧吧', '活动与服务体验']
    },
    {
      title: '钟摆青年的乌托邦',
      sub: '疗愈型广场景观设计',
      pages: [12, 13, 14, 15],
      notes: ['整体鸟瞰与设计说明', '现状与文化分析', '策略一 · 复合疗法', '策略与方案分析']
    },
    {
      title: '归园',
      sub: '安仁神乐园农家乐建筑改造',
      pages: [16, 17, 18],
      notes: ['整体鸟瞰与设计说明', '总平面 · 平面与分析', '剖面 · 立面与细部']
    },
    {
      title: '境·镜',
      sub: '湖南科技大学校园改造',
      pages: [19, 20, 21],
      notes: ['整体鸟瞰与设计说明', '平立面与剖轴测', '空间分析与实景意向']
    },
    {
      title: '手绘作品',
      sub: '景观快题与建筑钢笔画',
      pages: [22, 23],
      notes: ['景观快题设计', '鸟瞰 · 平面与钢笔画']
    }
  ];

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };

  /* ── 页脚年份 ── */
  $('#yy').textContent = new Date().getFullYear();

  /* ── 导航滚动状态 ── */
  var head = $('#siteHead');
  var onScroll = function () {
    head.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 移动端菜单 ── */
  var burger = $('#burger');
  var mnav = $('#mnav');
  var menuOpen = false;
  function setMenu(open) {
    menuOpen = open;
    burger.classList.toggle('on', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    if (open) {
      mnav.hidden = false;
      document.documentElement.classList.add('lock');
    } else {
      mnav.hidden = true;
      if (!lbOpen) document.documentElement.classList.remove('lock');
    }
  }
  burger.addEventListener('click', function () { setMenu(!menuOpen); });
  $$('a', mnav).forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  /* ── 导航高亮当前区块 ── */
  var navLinks = $$('.nav a');
  var sections = navLinks.map(function (a) { return $(a.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.setAttribute('aria-current', a.getAttribute('href') === '#' + en.target.id ? 'true' : 'false');
        });
      });
    }, { rootMargin: '-42% 0px -52% 0px' });
    sections.forEach(function (s) { if (s) navIO.observe(s); });
  }

  /* ── 滚动入场 ── */
  var rvs = $$('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
    rvs.forEach(function (el) { io.observe(el); });
  } else {
    rvs.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── 图纸灯箱 ── */
  var lb = $('#lb'), lbImg = $('#lbImg'),
      lbTitle = $('#lbTitle'), lbSub = $('#lbSub'),
      lbCount = $('#lbCount'), lbNote = $('#lbNote');
  var lbOpen = false, proj = null, idx = 0, lastFocus = null;

  function srcOf(page) { return 'assets/img/works/w' + pad2(page) + '.jpg'; }

  function preload(i) {
    if (!proj) return;
    var n = (i + proj.pages.length) % proj.pages.length;
    var im = new Image();
    im.src = srcOf(proj.pages[n]);
  }

  function render() {
    var total = proj.pages.length;
    idx = (idx + total) % total;
    lbImg.src = srcOf(proj.pages[idx]);
    lbImg.alt = '《' + proj.title + '》' + proj.notes[idx];
    lbCount.textContent = pad2(idx + 1) + ' / ' + pad2(total);
    lbNote.textContent = proj.notes[idx];
    preload(idx + 1);
    preload(idx - 1);
  }

  function openLb(p, i) {
    proj = PROJECTS[p];
    idx = i || 0;
    lastFocus = document.activeElement;
    lbTitle.textContent = '《' + proj.title + '》';
    lbSub.textContent = proj.sub;
    mnav.hidden = true; burger.classList.remove('on'); burger.setAttribute('aria-expanded', 'false');
    menuOpen = false;
    lb.hidden = false;
    lb.classList.remove('ready');
    render();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        lb.classList.add('open');
        lb.classList.add('ready');
      });
    });
    document.documentElement.classList.add('lock');
    lbOpen = true;
    $('#lbClose').focus();
  }

  function closeLb() {
    lb.classList.remove('open');
    lbOpen = false;
    window.setTimeout(function () {
      lb.hidden = true;
      lbImg.src = '';
    }, 380);
    document.documentElement.classList.remove('lock');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(d) { idx += d; render(); }

  $$('[data-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openLb(parseInt(btn.getAttribute('data-open'), 10), 0);
    });
  });
  $('#lbPrev').addEventListener('click', function () { step(-1); });
  $('#lbNext').addEventListener('click', function () { step(1); });
  $('#lbClose').addEventListener('click', closeLb);

  /* 点击图片外的背景区域关闭 */
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.classList.contains('lb-stage')) closeLb();
  });

  /* 键盘 */
  document.addEventListener('keydown', function (e) {
    if (!lbOpen) {
      if (e.key === 'Escape' && menuOpen) setMenu(false);
      return;
    }
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });

  /* 触摸滑动翻页 */
  var tx = 0, ty = 0;
  lb.addEventListener('touchstart', function (e) {
    tx = e.touches[0].clientX; ty = e.touches[0].clientY;
  }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - tx;
    var dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx > 0 ? -1 : 1);
  }, { passive: true });
})();
