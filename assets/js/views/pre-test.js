// ============================================================
// pre-test.js — §6.3: 5-question light assessment
// Shown when user says "No, I'm not sure" in profile branching
// Scores map to Software / Hardware / Hybrid direction
// ============================================================

const PRE_TEST_QS = [
  {
    id: 'pt1',
    text: {
      en: 'Which activity sounds most exciting to you?',
      ar: 'أيّ نشاط يبدو الأكثر إثارةً بالنسبة لك؟',
    },
    options: [
      { id: 'sw', text: { en: 'Building a mobile app',              ar: 'بناء تطبيق موبايل'             }, score: { software: 3 } },
      { id: 'hw', text: { en: 'Designing a circuit board',          ar: 'تصميم لوحة إلكترونية'          }, score: { hardware: 3 } },
      { id: 'hy', text: { en: 'Programming a microcontroller',      ar: 'برمجة مايكروكونترولر'           }, score: { hybrid: 3 } },
      { id: 'ci', text: { en: 'Analysing data to solve a problem',  ar: 'تحليل بيانات لحل مشكلة'        }, score: { software: 2, hybrid: 1 } },
    ],
  },
  {
    id: 'pt2',
    text: {
      en: 'How do you prefer to spend a free afternoon?',
      ar: 'كيف تُفضّل قضاء وقت فراغ؟',
    },
    options: [
      { id: 'sw', text: { en: 'Coding a small project or game',     ar: 'كتابة كود مشروع أو لعبة'       }, score: { software: 3 } },
      { id: 'hw', text: { en: 'Building or fixing a device',        ar: 'تركيب أو إصلاح جهاز'          }, score: { hardware: 3 } },
      { id: 'hy', text: { en: 'Tinkering with electronics & code',  ar: 'تجريب إلكترونيات وكود معاً'    }, score: { hybrid: 3 } },
      { id: 'ci', text: { en: 'Reading about systems & processes',  ar: 'قراءة عن أنظمة وعمليات'        }, score: { hardware: 1, hybrid: 1, software: 1 } },
    ],
  },
  {
    id: 'pt3',
    text: {
      en: 'Which problem would you rather tackle?',
      ar: 'أيّ مشكلة تُفضّل حلّها؟',
    },
    options: [
      { id: 'sw', text: { en: 'A slow web application',             ar: 'تطبيق ويب بطيء'               }, score: { software: 3 } },
      { id: 'hw', text: { en: 'A broken power supply unit',         ar: 'وحدة طاقة معطوبة'             }, score: { hardware: 3 } },
      { id: 'hy', text: { en: 'A robot that won't move correctly',  ar: 'روبوت لا يتحرك بشكل صحيح'     }, score: { hybrid: 3 } },
      { id: 'ci', text: { en: 'A dataset full of errors',           ar: 'مجموعة بيانات مليئة بالأخطاء'  }, score: { software: 2 } },
    ],
  },
  {
    id: 'pt4',
    text: {
      en: 'Which subject did you enjoy most at school?',
      ar: 'أيّ مادة استمتعت بها أكثر في المدرسة؟',
    },
    options: [
      { id: 'sw', text: { en: 'Computer Science / Programming',     ar: 'علوم الحاسب / البرمجة'         }, score: { software: 3 } },
      { id: 'hw', text: { en: 'Physics / Electronics',              ar: 'الفيزياء / الإلكترونيات'       }, score: { hardware: 3 } },
      { id: 'ma', text: { en: 'Mathematics / Logic',                ar: 'الرياضيات / المنطق'            }, score: { hybrid: 2, software: 1 } },
      { id: 'hy', text: { en: 'All of them equally',                ar: 'كلهم بنفس القدر'               }, score: { hybrid: 3 } },
    ],
  },
  {
    id: 'pt5',
    text: {
      en: 'What kind of engineer do you dream of being?',
      ar: 'ما نوع المهندس الذي تحلم أن تكونه؟',
    },
    options: [
      { id: 'sw', text: { en: 'Software / Web / App developer',     ar: 'مطوّر برمجيات / ويب / تطبيقات' }, score: { software: 3 } },
      { id: 'hw', text: { en: 'Electrical / Hardware engineer',     ar: 'مهندس كهربائي / هارد وير'      }, score: { hardware: 3 } },
      { id: 'hy', text: { en: 'Embedded / IoT / Robotics engineer', ar: 'مهندس Embedded / IoT / روبوتات' }, score: { hybrid: 3 } },
      { id: 'un', text: { en: 'I have no idea yet',                 ar: 'مش عارف لسه'                  }, score: { hybrid: 1, software: 1, hardware: 1 } },
    ],
  },
];

window._preTestUI = { answers: {}, done: false };

window.selectPreAnswer = function selectPreAnswer(qId, optId) {
  window._preTestUI.answers[qId] = optId;
  renderMainOnly();
};

window.submitPreTest = function submitPreTest() {
  const answers = window._preTestUI.answers;
  if (Object.keys(answers).length < PRE_TEST_QS.length) {
    showToast(state.language === 'ar' ? 'الرجاء الإجابة على جميع الأسئلة.' : 'Please answer all questions.', '#dc2626');
    return;
  }
  // tally scores
  const tally = { software: 0, hardware: 0, hybrid: 0 };
  PRE_TEST_QS.forEach(q => {
    const opt = q.options.find(o => o.id === answers[q.id]);
    if (!opt) return;
    Object.entries(opt.score || {}).forEach(([k, v]) => { tally[k] = (tally[k] || 0) + v; });
  });
  const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  const winner = sorted[0][0]; // 'software' | 'hardware' | 'hybrid'

  // map direction → suggested track ids
  const SUGGESTION = {
    software: ['software', 'data', 'cyber'],
    hardware: ['power', 'communications', 'electronics'],
    hybrid:   ['embedded', 'communications', 'data'],
  };
  const suggested = SUGGESTION[winner] || SUGGESTION.software;

  window._preTestUI.done     = true;
  window._preTestUI.winner   = winner;
  window._preTestUI.suggested = suggested;
  window._preTestUI.tally    = tally;
  renderMainOnly();
};

window.renderPreTestView = function renderPreTestView() {
  const isAr = state.language === 'ar';
  const ui   = window._preTestUI;

  // ── Results screen ──
  if (ui.done) {
    const DIRECTION_LABEL = {
      software: { en: 'Software / Digital',      ar: 'البرمجيات / الرقمي'       },
      hardware: { en: 'Electrical / Hardware',   ar: 'الكهربائي / الهارد وير'   },
      hybrid:   { en: 'Embedded / Hybrid',       ar: 'المدمج / الهايبريد'        },
    };
    const lang    = isAr ? 'ar' : 'en';
    const dirLabel = DIRECTION_LABEL[ui.winner]?.[lang] || ui.winner;
    const total   = Object.values(ui.tally).reduce((a, b) => a + b, 0);
    const bars    = Object.entries(ui.tally)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => {
        const pct = total ? Math.round((v / total) * 100) : 0;
        const colors = { software: '#2563eb', hardware: '#d97706', hybrid: '#7c3aed' };
        const names  = {
          software: { en: 'Software', ar: 'برمجيات' },
          hardware: { en: 'Hardware', ar: 'كهربائي' },
          hybrid:   { en: 'Hybrid',   ar: 'مدمج'    },
        };
        return `
          <div style="margin-bottom:.7rem;">
            <div style="display:flex;justify-content:space-between;font-size:.8rem;font-weight:600;margin-bottom:.3rem;">
              <span>${names[k]?.[lang] || k}</span><span>${pct}%</span>
            </div>
            <div style="background:var(--border);border-radius:99px;height:7px;overflow:hidden;">
              <div style="height:100%;width:${pct}%;background:${colors[k]||'var(--accent)'};border-radius:99px;transition:width .5s ease;"></div>
            </div>
          </div>`;
      }).join('');

    return `
      <div style="display:grid;gap:1.25rem;max-width:600px;margin:0 auto;padding:1.5rem 0;">
        <div class="surface-panel section-pad" data-aos="fade-up" style="text-align:center;">
          <div style="width:56px;height:56px;border-radius:18px;background:var(--accent-soft);
            border:1px solid rgba(37,99,235,.2);display:flex;align-items:center;justify-content:center;
            margin:0 auto 1rem;">
            <i data-lucide="compass" style="width:1.5rem;height:1.5rem;color:var(--accent);"></i>
          </div>
          <div class="eyebrow" style="margin-bottom:.4rem;">${isAr ? 'اتجاهك المقترح' : 'Your suggested direction'}</div>
          <h2 style="font-size:1.35rem;font-weight:900;color:var(--accent);">${dirLabel}</h2>
          <p class="text-muted" style="margin-top:.6rem;font-size:.88rem;line-height:1.7;">
            ${isAr
              ? 'بناءً على إجاباتك، ده الاتجاه الأنسب ليك. ممكن تكمل الاختبار الكامل لنتيجة أدق.'
              : 'Based on your answers, this direction suits you best. Take the full test for a more precise result.'}
          </p>
        </div>

        <div class="surface-panel section-pad" data-aos="fade-up">
          <div class="eyebrow" style="margin-bottom:.85rem;">${isAr ? 'توزيع نقاطك' : 'Your score breakdown'}</div>
          ${bars}
        </div>

        <div class="surface-panel section-pad" data-aos="fade-up">
          <div class="eyebrow" style="margin-bottom:.85rem;">${isAr ? 'التراكات المقترحة' : 'Suggested tracks'}</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:.6rem;margin-bottom:1rem;">
            ${(ui.suggested || []).map(tid => {
              const tr = window.TRACKS?.[tid];
              if (!tr) return '';
              const lang = isAr ? 'ar' : 'en';
              return `
                <button onclick="pickTrackDirect('${tid}')"
                  style="background:var(--surface-2);border:1.5px solid var(--border);border-radius:12px;
                    padding:.8rem .6rem;cursor:pointer;text-align:center;
                    transition:border-color .15s,transform .15s;"
                  onmouseover="this.style.borderColor='var(--accent)';this.style.transform='translateY(-2px)';"
                  onmouseout="this.style.borderColor='var(--border)';this.style.transform='';">
                  <div style="font-weight:700;font-size:.85rem;color:var(--text);">${tr.title?.[lang] || tid}</div>
                </button>`;
            }).join('')}
          </div>
          <div style="display:flex;gap:.7rem;flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="navigateTo('test')">
              <i data-lucide="clipboard-list" style="width:.9rem;height:.9rem;"></i>
              ${isAr ? 'الاختبار الكامل' : 'Full assessment'}
            </button>
            <button class="btn btn-secondary" onclick="window._preTestUI={answers:{},done:false};renderMainOnly();">
              ${isAr ? 'أعد الاختبار الخفيف' : 'Retake quick test'}
            </button>
          </div>
        </div>
      </div>`;
  }

  // ── Questions screen ──
  const answered = Object.keys(ui.answers).length;
  const total    = PRE_TEST_QS.length;
  const pct      = Math.round((answered / total) * 100);

  return `
    <div style="max-width:600px;margin:0 auto;padding:1.5rem 0;">

      <!-- header -->
      <div style="text-align:center;margin-bottom:1.5rem;" data-aos="fade-up">
        <div class="eyebrow" style="margin-bottom:.3rem;">§6.3 — ${isAr ? 'اختبار سريع' : 'Quick Pre-Test'}</div>
        <h2 style="font-size:1.1rem;font-weight:800;">${isAr ? '5 أسئلة تحدد اتجاهك' : '5 questions to find your direction'}</h2>
        <div style="margin-top:.7rem;background:var(--border);border-radius:99px;height:5px;overflow:hidden;max-width:280px;margin-inline:auto;">
          <div style="height:100%;width:${pct}%;background:var(--accent);border-radius:99px;transition:width .4s ease;"></div>
        </div>
        <div style="font-size:.75rem;color:var(--text-muted);margin-top:.3rem;">${answered}/${total} ${isAr ? 'مكتمل' : 'answered'}</div>
      </div>

      <!-- questions -->
      <div style="display:grid;gap:1rem;">
        ${PRE_TEST_QS.map((q, qi) => {
          const ans  = ui.answers[q.id];
          const lang = isAr ? 'ar' : 'en';
          return `
            <div class="surface-panel section-pad" data-aos="fade-up" data-aos-delay="${qi * 60}">
              <div style="font-size:.75rem;color:var(--text-muted);margin-bottom:.4rem;font-weight:600;">
                ${isAr ? `السؤال ${qi + 1}` : `Question ${qi + 1}`}
              </div>
              <div style="font-size:.97rem;font-weight:700;margin-bottom:.85rem;line-height:1.5;">${q.text[lang]}</div>
              <div style="display:grid;gap:.4rem;">
                ${q.options.map(opt => {
                  const sel = ans === opt.id;
                  return `
                    <button onclick="selectPreAnswer('${q.id}','${opt.id}')"
                      style="display:flex;align-items:center;gap:.7rem;padding:.6rem .85rem;
                        border-radius:10px;border:1.5px solid ${sel ? 'var(--accent)' : 'var(--border)'};
                        background:${sel ? 'var(--accent-soft)' : 'var(--surface-2)'};
                        cursor:pointer;transition:border-color .15s,background .15s;text-align:start;">
                      <div style="width:1.1rem;height:1.1rem;border-radius:50%;flex-shrink:0;
                        background:${sel ? 'var(--accent)' : 'transparent'};
                        border:2px solid ${sel ? 'var(--accent)' : 'var(--border)'};
                        display:flex;align-items:center;justify-content:center;">
                        ${sel ? '<i data-lucide="check" style="width:.55rem;height:.55rem;color:#fff;"></i>' : ''}
                      </div>
                      <span style="font-size:.88rem;font-weight:${sel ? '700' : '500'};color:var(--text);">${opt.text[lang]}</span>
                    </button>`;
                }).join('')}
              </div>
            </div>`;
        }).join('')}
      </div>

      <!-- submit -->
      <div style="margin-top:1.25rem;display:flex;gap:.7rem;flex-wrap:wrap;justify-content:center;">
        <button class="btn btn-primary" onclick="submitPreTest()" style="min-width:160px;">
          <i data-lucide="send" style="width:.9rem;height:.9rem;"></i>
          ${isAr ? 'اعرض نتيجتي' : 'Show my result'}
        </button>
        <button class="btn btn-secondary" onclick="navigateTo('test')">
          ${isAr ? 'الاختبار الكامل بدلاً من ذلك' : 'Take full test instead'}
        </button>
      </div>
    </div>`;
};
