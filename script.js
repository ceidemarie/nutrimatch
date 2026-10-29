// 1. Core State & Session Initialization
let currentSubCategory = 'All';
const urlParams = new URLSearchParams(window.location.search);
let isPro = urlParams.get('subscribed') === 'true';

if (isPro) {
    sessionStorage.setItem('nutrimatch_pro_session', 'true');
} else {
    isPro = sessionStorage.getItem('nutrimatch_pro_session') === 'true';
}

// 2. Tab Navigation
function switchTab(tabId) {
    ['about', 'symptoms', 'discoveries', 'recipes'].forEach(t => {
        const el = document.getElementById(`tab-${t}`);
        if (el) el.classList.add('hidden');
        const navBtn = document.getElementById(`nav-${t}`);
        if (navBtn) {
            navBtn.classList.remove('border-brand-600', 'text-brand-700');
            navBtn.classList.add('border-transparent', 'text-slate-500');
        }
    });

    const activeTab = document.getElementById(`tab-${tabId}`);
    if (activeTab) activeTab.classList.remove('hidden');

    const activeNav = document.getElementById(`nav-${tabId}`);
    if (activeNav) {
        activeNav.classList.remove('border-transparent', 'text-slate-500');
        activeNav.classList.add('border-brand-600', 'text-brand-700');
    }

    if (tabId === 'symptoms') {
        renderSymptoms();
    } else if (tabId === 'recipes') {
        renderRecipes();
    }
}

// 3. Membership & Stripe (Your Working Stripe Link)
function toggleMembership() {
    if (isPro) {
        alert("You are already subscribed to NutriMatch Pro!");
    } else {
        window.location.href = "https://buy.stripe.com/14A14f3aU0Mf3KC9QcfnO00";
    }
}

function updateMembershipUI() {
    const badge = document.getElementById('memberBadge');
    const text = document.getElementById('memberText');
    const btn = document.getElementById('membershipBtn');
    const bannerBtn = document.getElementById('bannerMembershipBtn');

    if (isPro) {
        if (badge) badge.className = 'w-2 h-2 rounded-full bg-brand-500 animate-pulse';
        if (text) text.innerText = 'NutriMatch Pro Active';
        if (btn) btn.className = 'inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm border border-brand-300 bg-brand-50 text-brand-800 hover:bg-brand-100';
        if (bannerBtn) {
            bannerBtn.innerText = 'Pro Active ✓';
            bannerBtn.className = 'px-6 py-3 bg-emerald-600 text-white font-bold text-sm rounded-xl transition shadow-md whitespace-nowrap cursor-default';
        }
    } else {
        if (badge) badge.className = 'w-2 h-2 rounded-full bg-slate-400';
        if (text) text.innerText = 'Upgrade to Pro (£7.99/mo)';
        if (btn) btn.className = 'inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm border border-emerald-300 bg-emerald-50 text-brand-800 hover:bg-emerald-100';
        if (bannerBtn) {
            bannerBtn.innerText = 'Join NutriMatch Pro (£7.99/mo)';
            bannerBtn.className = 'px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-xl transition shadow-md whitespace-nowrap cursor-pointer';
        }
    }

    // Toggle static HTML discovery cards based on Pro state (runs for both states)
    document.querySelectorAll('.is-pro-content').forEach(el => {
        if (isPro) {
            el.classList.remove('blur-[4px]', 'select-none', 'pointer-events-none', 'opacity-50');
        } else {
            el.classList.add('blur-[4px]', 'select-none', 'pointer-events-none', 'opacity-50');
        }
    });

    document.querySelectorAll('.is-pro-overlay').forEach(el => {
        if (isPro) {
            el.classList.add('hidden');
        } else {
            el.classList.remove('hidden');
        }
    });
}

// 4. Sub-category & Filtering
function setSubCategory(category) {
    currentSubCategory = category;
    document.querySelectorAll('.subtab-btn').forEach(btn => {
        if (btn.innerText.trim() === category) {
            btn.className = 'subtab-btn px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap bg-brand-600 text-white cursor-pointer';
        } else {
            btn.className = 'subtab-btn px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer';
        }
    });
    renderSymptoms();
}

function filterSymptoms() {
    renderSymptoms();
}

// 5. Legal Modal Toggle
function toggleLegalModal(show) {
    const modal = document.getElementById('legalModal');
    if (modal) {
        if (show) {
            modal.classList.remove('hidden');
        } else {
            modal.classList.add('hidden');
        }
    }
}

// 6. Dataset with RDA Added
const symptomsData = [
    // --- ENERGY (3) ---
    {
        id: 'lethargy',
        title: 'Lethargy & Fatigue',
        category: 'Energy',
        isFree: true,
        deficiency: 'Iron, Vitamin B12, or Magnesium',
        rda: 'Iron: ~8–18 mg/day | B12: ~2.4 mcg/day | Magnesium: ~320–420 mg/day',
        portion: 'Cooked Lentils (1 cup / ~198g = ~6.6 mg Iron) OR Pumpkin Seeds (30g = ~150 mg Magnesium)',
        biohack: 'Pair non-heme iron sources with Vitamin C rich foods (lemon squeeze or bell peppers) to boost absorption by up to 300%. Avoid tea/coffee within 1 hour of meals.',
        herbal: 'Nettle Leaf Tea (1-2 tsp dried nettle steeped in 250ml boiling water for 10 mins). Rich in bioavailable minerals.'
    },
    {
        id: 'chronic-fatigue',
        title: 'Adrenal Exhaustion & Burnout',
        category: 'Energy',
        isFree: false,
        deficiency: 'Vitamin B5 (Pantothenic Acid) & Adaptogens',
        rda: 'Vitamin B5: ~5 mg/day (adult target)',
        portion: 'Avocado (1 medium / ~150g = ~2 mg B5) OR Wild Salmon (150g = ~2.8 mg B5)',
        biohack: 'Combine healthy fats with sea salt to support adrenal cortex output during peak stress windows.',
        herbal: 'Ashwagandha Root Decoction (Simmer 1 tsp powdered root in plant milk for 10 minutes).'
    },
    {
        id: 'cold-extremities',
        title: 'Cold Hands & Feet',
        category: 'Energy',
        isFree: false,
        deficiency: 'Iron & Circulation Factors',
        rda: 'Iron: ~8–18 mg/day | Cocoa Flavanols: ~200 mg/day for endothelial circulation',
        portion: 'Dark Cocoa Powder (2 tbsp / ~10g = ~1.8 mg Iron + Cocoa Flavanols) OR Sesame Seeds (30g = ~4 mg Iron)',
        biohack: 'Combine vasodilating cocoa flavanols with warm water or ginger to improve peripheral blood flow.',
        herbal: 'Ginkgo Biloba & Cinnamon Infusion (Steep 1 tsp dried ginkgo with a cinnamon stick).'
    },

    // --- MUSCULOSKELETAL (3) ---
    {
        id: 'muscle-cramps',
        title: 'Muscle Cramps & Spasms',
        category: 'Musculoskeletal',
        isFree: true,
        deficiency: 'Magnesium or Potassium',
        rda: 'Magnesium: ~320–420 mg/day | Potassium: ~2,600–3,400 mg/day',
        portion: 'Raw Almonds (1/2 cup / ~70g = ~190 mg Magnesium) OR Cooked Spinach (1 cup = ~840 mg Potassium)',
        biohack: 'Consume magnesium prior to bedtime to support muscular relaxation and parasympathetic tone.',
        herbal: 'Chamomile Infusion (2 tsp dried chamomile flowers steeped for 10 mins) to support neuromuscular ease.'
    },
    {
        id: 'joint-stiffness',
        title: 'Joint Stiffness & Inflammation',
        category: 'Musculoskeletal',
        isFree: false,
        deficiency: 'Curcuminoids & Omega-3 Fats (ALA)',
        rda: 'Omega-3 ALA: ~1.1–1.6 g/day | Curcumin Active Dose: ~500–1,000 mg/day',
        portion: 'Fresh Turmeric Root (5g grated = ~150 mg active Curcumin) OR Flaxseed Oil (1 tbsp = ~7g ALA)',
        biohack: 'Always heat fresh turmeric with a pinch of black pepper and a healthy fat (coconut oil) for optimal absorption.',
        herbal: 'Turmeric Golden Milk (Simmer 1 tsp turmeric, pinch pepper, 1/2 tsp cinnamon in plant milk).'
    },
    {
        id: 'muscle-weakness',
        title: 'Low Muscle Tone & Recovery Lag',
        category: 'Musculoskeletal',
        isFree: false,
        deficiency: 'Amino Acids & Vitamin D3',
        rda: 'Protein: ~0.8–1.2 g/kg body weight | Vitamin D3: ~600–2,000 IU/day',
        portion: 'Pumpkin Seeds (40g = ~12g Protein + ~230 mg Magnesium) OR Pastured Eggs (2 large = ~12g Protein)',
        biohack: 'Consume complete proteins alongside vitamin D-rich foods within 2 hours post-exertion for cellular repair.',
        herbal: 'Alfalfa Infusion (Steep 1 tsp dried alfalfa leaves in hot water for 15 minutes to supply trace minerals).'
    },

    // --- IMMUNE SYSTEM (3) ---
    {
        id: 'immunity',
        title: 'Frequent Colds & Low Immunity',
        category: 'Immune System',
        isFree: true,
        deficiency: 'Vitamin C or Zinc',
        rda: 'Vitamin C: ~75–90 mg/day | Zinc: ~8–11 mg/day',
        portion: 'Yellow Bell Pepper (1/2 medium pepper / ~75g = ~137 mg Vitamin C) OR Raw Pumpkin Seeds (30g = ~2.2 mg Zinc)',
        biohack: 'Consume bell peppers raw rather than cooked, as thermal heating degrades water-soluble Vitamin C.',
        herbal: 'Echinacea & Elderberry Decoction. Simmer 1 tsp elderberries for 10 mins, steep with Echinacea root.'
    },
    {
        id: 'slow-healing',
        title: 'Slow Wound Healing & Skin Vulnerability',
        category: 'Immune System',
        isFree: false,
        deficiency: 'Zinc & Protein Matrix',
        rda: 'Zinc: ~8–11 mg/day | Bioavailable Amino Acids',
        portion: 'Oysters (3 medium = ~16 mg Zinc) OR Hemp Seeds (3 tbsp / ~30g = ~3 mg Zinc)',
        biohack: 'Pair plant-based zinc sources with organic apple cider vinegar to lower gastric pH and increase assimilation.',
        herbal: 'Calendula Flower Tea (Steep 1 tsp dried calendula petals for 8 minutes to support tissue regeneration).'
    },
    {
        id: 'respiratory-congestion',
        title: 'Mucus Buildup & Sinus Congestion',
        category: 'Immune System',
        isFree: false,
        deficiency: 'Bioflavonoids (Quercetin) & Mucolytic Nutrients',
        rda: 'Quercetin Target: ~500 mg/day during immune challenge',
        portion: 'Fresh Horseradish (1 tsp grated) OR Red Onions (1/2 medium = ~25 mg Quercetin)',
        biohack: 'Pair raw pungent alliums with lemon juice to activate volatile oils that clear upper respiratory pathways.',
        herbal: 'Thyme & Mullein Steam Inhalation (Boil dried thyme and mullein, inhale steam under a towel for 5 minutes).'
    },

    // --- GUT & BRAIN (3) ---
    {
        id: 'bloating',
        title: 'Bloating & Slow Digestion',
        category: 'Gut & Brain',
        isFree: false,
        deficiency: 'Digestive Enzymes & Probiotic Fiber',
        rda: 'Dietary Fiber: ~25–30 g/day | Active Fermented Foods: 1–2 servings daily',
        portion: 'Papaya (1 cup diced / ~140g = ~250 mg natural Papain) OR Fermented Sauerkraut (2 tbsp / ~30g)',
        biohack: 'Eat digestive enzymes/bitters 15 minutes before heavy protein meals to prime gastric acid production naturally.',
        herbal: 'Ginger & Fennel Tea (1 tsp grated fresh ginger + 1/2 tsp crushed fennel seeds steeped in 250ml hot water).'
    },
    {
        id: 'brain-fog',
        title: 'Brain Fog & Poor Focus',
        category: 'Gut & Brain',
        isFree: false,
        deficiency: 'Omega-3 Fatty Acids (ALA) & B-Complex',
        rda: 'Omega-3 ALA: ~1.1–1.6 g/day | Vitamin B12: ~2.4 mcg/day',
        portion: 'Walnuts (1/4 cup / ~30g = ~2.5g ALA) OR Chia Seeds (2 tbsp / ~28g = ~5g ALA)',
        biohack: 'Grind chia and flax seeds before consumption to break the fibrous outer shell and access interior lipids.',
        herbal: 'Gotu Kola / Rosemary Infusion. Steep 1 tsp dried rosemary in hot water to enhance cognitive alertness.'
    },
    {
        id: 'leaky-gut',
        title: 'Intestinal Permeability & Reflux Tendency',
        category: 'Gut & Brain',
        isFree: false,
        deficiency: 'L-Glutamine & Butyrate Precursors',
        rda: 'L-Glutamine: ~5–10 g/day | Resistant Starch: ~15–20 g/day',
        portion: 'Cabbage Juice (100ml raw pressed) OR Cooked/Cooled Potatoes (1 medium = ~3.5g Resistant Starch)',
        biohack: 'Drink raw cabbage juice on an empty stomach to deliver natural S-methylmethionine (Vitamin U) to mucosal linings.',
        herbal: 'Slippery Elm Bark Tea (Mix 1 tsp slippery elm powder in warm water to create a soothing demulcent coat).'
    },

    // --- NERVOUS SYSTEM (3) ---
    {
        id: 'insomnia',
        title: 'Sleep Disturbances & Insomnia',
        category: 'Nervous System',
        isFree: false,
        deficiency: 'Tryptophan & Magnesium',
        rda: 'Tryptophan: ~250–400 mg/day | Magnesium: ~320–420 mg/day',
        portion: 'Tart Cherry Juice (200ml = ~9 mcg natural Melatonin) OR Pumpkin Seeds (30g = ~160 mg Tryptophan precursor)',
        biohack: 'Combine tryptophan foods with a small complex carbohydrate portion to increase blood-brain barrier uptake.',
        herbal: 'Valerian Root & Lemon Balm Tea (Steep 1 tsp dried valerian root for 12 minutes).'
    },
    {
        id: 'anxiety',
        title: 'Mild Anxiety & Nervous Tension',
        category: 'Nervous System',
        isFree: false,
        deficiency: 'GABA Precursors & Vitamin B6',
        rda: 'Vitamin B6: ~1.3–1.7 mg/day',
        portion: 'Sunflower Seeds (30g = ~0.4 mg B6) OR Cooked Chickpeas (1/2 cup / ~82g = ~0.6 mg B6)',
        biohack: 'Pair B6-rich sources with whole grains to encourage steady serotonin and GABA synthesis.',
        herbal: 'Passionflower Tea (1.5g dried passionflower herb steeped for 8 minutes).'
    },
    {
        id: 'headaches',
        title: 'Tension Headaches',
        category: 'Nervous System',
        isFree: false,
        deficiency: 'Hydration Electrolytes & Riboflavin (B2)',
        portion: 'Coconut Water (300ml = ~600 mg Potassium) + Almonds (30g = ~0.3 mg Riboflavin)',
        rda: 'Riboflavin (B2): ~1.1–1.3 mg/day | Potassium: ~2,600–3,400 mg/day',
        biohack: 'Consume electrolyte-rich fluid alongside a small pinch of unrefined sea salt at the onset of tension.',
        herbal: 'Feverfew Infusion (Steep 1 tsp dried feverfew leaves in 200ml boiling water).'
    },

    // --- APPEARANCE (3) ---
    {
        id: 'hair-skin-nails',
        title: 'Brittle Hair & Weak Nails',
        category: 'Appearance',
        isFree: false,
        deficiency: 'Biotin, Silica & Zinc',
        rda: 'Biotin: ~30 mcg/day | Zinc: ~8–11 mg/day',
        portion: 'Cooked Oats (1 cup / ~234g = ~15 mcg Biotin) OR Sunflower Seeds (30g = ~1.5 mg Zinc)',
        biohack: 'Ensure adequate stomach acid levels to liberate bound zinc and silica from plant fibers.',
        herbal: 'Horsetail Tea (Steep 1 tsp dried horsetail herb rich in organic silica for 15 minutes).'
    },
    {
        id: 'mouth-sores',
        title: 'Mouth Sores & Angular Cheilitis',
        category: 'Appearance',
        isFree: false,
        deficiency: 'Riboflavin (B2) or Folate',
        rda: 'Folate: ~400 mcg DFE/day | Riboflavin (B2): ~1.1–1.3 mg/day',
        portion: 'Nutritional Yeast (1 tbsp / ~10g = ~5 mg B2 + ~240 mcg Folate) OR Asparagus (1/2 cup = ~130 mcg Folate)',
        biohack: 'Avoid ultra-processed refined sugars which deplete active B-vitamin cofactors during metabolism.',
        herbal: 'Calendula & Sage Mouth Rinse (Cool infusion of calendula flowers used as a soothing oral rinse).'
    },
    {
        id: 'dull-skin',
        title: 'Dry & Dehydrated Complexion',
        category: 'Appearance',
        isFree: false,
        deficiency: 'Essential Fatty Acids & Vitamin E',
        rda: 'Vitamin E: ~15 mg/day | Linoleic Acid: ~11–14 g/day',
        portion: 'Raw Walnuts (30g = ~2.5g ALA) OR Sunflower Seeds (30g = ~7.4 mg Vitamin E)',
        biohack: 'Pair raw seed oils with antioxidant-rich berries to protect dermal lipids from oxidative breakdown.',
        herbal: 'Burdock Root Tea (Simmer 1 tsp dried burdock root for 10 minutes to support skin detoxification).'
    }
];

// 7. Render Symptoms
function renderSymptoms() {
    const grid = document.getElementById('symptomsGrid');
    if (!grid) return;

    const searchQuery = (document.getElementById('searchInput')?.value || '').toLowerCase();

    const filtered = symptomsData.filter(s => {
        const matchesCat = (currentSubCategory === 'All') || (s.category === currentSubCategory);
        const matchesSearch = s.title.toLowerCase().includes(searchQuery) ||
                              s.deficiency.toLowerCase().includes(searchQuery) ||
                              s.portion.toLowerCase().includes(searchQuery);
        return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-12 text-center text-slate-400 text-sm">
                No symptoms matching your search or category filter.
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(s => {
        const isLocked = !s.isFree && !isPro;

        if (isLocked) {
            return `
                <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                    <div class="filter blur-[3px] select-none pointer-events-none space-y-3 opacity-60">
                        <div class="flex justify-between items-start">
                            <h3 class="font-bold text-slate-900">${s.title}</h3>
                            <span class="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">${s.category}</span>
                        </div>
                        <p class="text-xs text-slate-500"><strong>Target Deficiency:</strong> ${s.deficiency}</p>
                        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                            <span class="font-semibold text-slate-700">Exact Serving Portion:</span>
                            <p class="text-slate-600">${s.portion}</p>
                        </div>
                    </div>
                    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center text-white space-y-2">
                        <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">🔒</div>
                        <h4 class="font-bold text-sm">${s.title}</h4>
                        <p class="text-xs text-slate-200 max-w-xs">Pro content. Unlock exact portions, RDAs, bio-hacks & remedies.</p>
                        <button onclick="toggleMembership()" class="mt-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-lg transition shadow-md cursor-pointer">
                            Unlock for £7.99/mo
                        </button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:border-brand-300 transition-all">
                <div class="space-y-3">
                    <div class="flex justify-between items-start gap-2">
                        <h3 class="font-bold text-slate-900 text-lg">${s.title}</h3>
                        <span class="text-[10px] bg-brand-50 text-brand-800 font-bold px-2.5 py-1 rounded-md border border-brand-200">${s.category}</span>
                    </div>
                    <p class="text-xs text-slate-600"><strong>Key Deficiency:</strong> ${s.deficiency}</p>
                    
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1 text-xs">
                        <span class="font-bold text-slate-700 block">📊 Recommended Daily Amount (RDA Target):</span>
                        <p class="text-slate-600 leading-relaxed font-medium">${s.rda}</p>
                    </div>

                    <div class="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 space-y-1 text-xs">
                        <span class="font-bold text-brand-900 block">🎯 Exact Food Portion & Nutrient Content:</span>
                        <p class="text-slate-700 leading-relaxed">${s.portion}</p>
                    </div>

                    <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1 text-xs">
                        <span class="font-bold text-slate-800 block">🧪 Bioavailability Bio-Hack:</span>
                        <p class="text-slate-600 leading-relaxed">${s.biohack}</p>
                    </div>
                </div>
                <div class="pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <span class="font-bold text-brand-800 block mb-1">🍵 Holistic Remedy:</span>
                    <p>${s.herbal}</p>
                </div>
            </div>
        `;
    }).join('');
}


// ==========================================
// 8. WEEKLY RECIPES & MEMBERSHIP PAYWALL MODULE
// ==========================================
const recipesData = [
    {
        id: 'high-protein-gf-banana-bread',
        title: 'High-Protein Gluten-Free Banana Bread',
        category: 'Energy & Gut Health',
        prepTime: '10 mins prep | 45-50 mins bake @ 180°C',
        servings: '10-12 slices',
        baseIngredients: [
            '5 medium ripe bananas (mashed)',
            '70g Gluten-Free Self-Raising Flour',
            '100g Protein Powder (Vanilla or Unflavored)',
            '2 large eggs',
            '25ml Oat Milk (or milk of choice)',
            '1 tsp Baking Powder',
            '2 squares Dark Chocolate (chopped or melted on top)'
        ],
        substitutions: [
            { ingredient: 'Instead of GF Self-Raising Flour', option: 'Use 70g Regular Self-Raising Flour (if gluten is tolerated) OR 70g Oat Flour + 1/2 tsp extra baking powder.' },
            { ingredient: 'Instead of Protein Powder', option: 'Use 100g Oat Flour or Almond Flour + 1 extra tbsp milk.' },
            { ingredient: 'Instead of Eggs (Egg-Free / Vegan)', option: 'Use 2 "Flax Eggs" (2 tbsp ground flaxseed mixed with 5 tbsp warm water; let sit for 5 mins until gelled).' },
            { ingredient: 'Instead of Oat Milk', option: 'Use Almond milk, Coconut milk, or Dairy milk in equal amounts (25ml).' }
        ],
        instructions: [
            'Preheat oven to 180°C (350°F) and line a loaf tin with baking paper.',
            'In a large bowl, mash the 5 ripe bananas until smooth.',
            'Whisk in the eggs (or flax eggs) and oat milk.',
            'Fold in the gluten-free flour, protein powder, and baking powder until just combined.',
            'Pour batter into the loaf tin and top with chopped dark chocolate squares.',
            'Bake for 45–50 minutes until a toothpick inserted into the center comes out clean. Cool completely before slicing.'
        ],
        benefit: 'High in bioavailable potassium & magnesium from bananas, rich in blood-sugar-stabilizing protein, and gentle on sensitive digestive tracts.'
    }
];

function renderRecipes() {
    const grid = document.getElementById('recipesGrid');
    if (!grid) return;

    if (!isPro) {
        grid.innerHTML = `
            <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-6 col-span-full max-w-xl mx-auto my-6">
                <div class="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto text-3xl">🔒</div>
                <div class="space-y-2">
                    <h3 class="font-bold text-slate-900 text-2xl">Unlock Weekly Therapeutic Recipes</h3>
                    <p class="text-slate-600 text-sm">Get full access to gut-friendly, therapeutic meal plans with exact dietary substitutions (GF, Vegan, Regular) for just <span class="font-bold text-slate-900">£7.99/month</span>.</p>
                </div>
                <div class="pt-2 space-y-3">
                    <button onclick="toggleMembership()" class="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-xl shadow-sm transition-all cursor-pointer">
                        Upgrade Now (£7.99/mo)
                    </button>
                    <p class="text-xs text-slate-400">Cancel anytime. Instant access to all current and future weekly meal plans.</p>
                </div>
            </div>
        `;
        return;
    }

    grid.innerHTML = recipesData.map(r => `
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 col-span-full">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                <div>
                    <h3 class="font-bold text-slate-900 text-xl">${r.title}</h3>
                    <p class="text-xs text-brand-700 font-bold">${r.category}</p>
                </div>
                <span class="text-xs bg-slate-100 text-slate-600 font-medium px-3 py-1 rounded-full">⏱️ ${r.prepTime} | 🍽️ ${r.servings}</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
                    <strong class="text-slate-800 block text-sm">🥣 Master Ingredients:</strong>
                    <ul class="list-disc pl-4 text-slate-600 space-y-1">
                        ${r.baseIngredients.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                </div>

                <div class="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 space-y-2 text-xs">
                    <strong class="text-brand-900 block text-sm">🔄 Dietary Substitutions & Swaps:</strong>
                    <ul class="space-y-1.5 text-slate-700">
                        ${r.substitutions.map(sub => `<li><strong>${sub.ingredient}:</strong> ${sub.option}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                <strong class="text-slate-900 block text-sm">👩‍🍳 Step-by-Step Instructions:</strong>
                <ol class="list-decimal pl-4 space-y-1 leading-relaxed">
                    ${r.instructions.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>

            <div class="p-3 bg-brand-50 rounded-xl border border-brand-200 text-xs text-brand-900">
                💡 <strong>NutriMatch Benefit:</strong> ${r.benefit}
            </div>
        </div>
    `).join('');
}


// ==========================================
// 9. Page Load Initialization
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    if (urlParams.get('subscribed') === 'true') {
        window.history.replaceState({}, document.title, window.location.pathname);
        alert("Welcome to NutriMatch Pro! Your subscription is now active.");
    }
    updateMembershipUI();
    renderSymptoms();
});