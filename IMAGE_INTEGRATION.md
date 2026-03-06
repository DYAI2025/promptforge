# Bild-KI-Integration für PromptForge

## Executive Summary

PromptForge ist ideal positioniert für die Integration von Bild-KI-Generatoren. Die strukturierten Prompts mit Quality Scoring, Intent Detection und Multi-Layer-Constraints produzieren überlegene Ergebnisse bei allen großen Bild-KIs.

---

## 1. Empfohlene Bildgeneratoren

### Top-Empfehlungen (Ranking nach Prompt-Qualität)

| Rang | Modell | API-Kosten | Commercial Use | Warum es passt |
|------|--------|------------|----------------|----------------|
| **1** | **Midjourney v6** | $10-120/Monat | ✅ (Paid Plan) | Beste Prompt-Interpretation, versteht komplexe Strukturen |
| **2** | **DALL-E 3** | $0.040/Bild | ✅ | Versteht natürliche Sprache exzellent |
| **3** | **Stable Diffusion XL** | $0.002-0.007/Bild | ✅ (Open License) | Open-Source, anpassbar, günstigster Start |
| **4** | **Adobe Firefly** | Inklusiv CC | ✅ (Commercial Safe) | Copyright-sicher für Enterprise |
| **5** | **Leonardo.ai** | $0.01-0.03/Bild | ✅ | Game-Art spezialisiert |
| **6** | **Ideogram** | Kostenlos-$$ | ⚠️ | Text-in-Bild (Logos, Typography) |

---

## 2. Warum PromptForge-Prompts überlegen sind

### Struktur-Vorteile

```
PromptForge generiert für Bild-KIs:
✅ Klare Subjekt-Definition (wer/was im Bild)
✅ Kontext-Rahmen (Umgebung, Situation, Zeit)
✅ Stil-Parameter (Kunststil, Ära, Technik, Künstler-Referenzen)
✅ Technische Specs (Licht, Kamera, Render-Engine, Auflösung)
✅ Negative Constraints (was NICHT im Bild erscheinen soll)
✅ Format-Angaben (Seitenverhältnis, Komposition)
```

### Beispiel: PromptForge → Midjourney

**User Input:**
> "Cyberpunk-Stadtbild"

**PromptForge generiert:**
```
Futuristic cyberpunk cityscape at night, 
neon-lit skyscrapers with holographic advertisements, 
flying vehicles in motion blur, rain-slicked streets reflecting 
purple and cyan lights, dense urban atmosphere with steam rising, 
cinematic composition, shot on 35mm lens f/2.8, 
Blade Runner 2049 aesthetic, hyper-detailed, 8K --ar 16:9 --v 6.0

Negative: no blur, no distortion, no watermark, no text overlay
```

**Warum es funktioniert:**
- Midjourney v6 versteht **natürliche Sprache + technische Parameter**
- PromptForge liefert **strukturierte Details** statt vager Beschreibungen
- **Negative Constraints** reduzieren unerwünschte Artefakte
- **Quality Score** garantiert Prompt-Qualität vor Generation

---

## 3. Technische Integration

### API-Wrapper Architektur

```javascript
// src/image-generator.js
export const IMAGE_PROVIDERS = {
  stability: {
    endpoint: 'https://api.stability.ai/v2beta/stable-image/generate/sd3',
    pricing: { perImage: 0.0035 },
    formats: ['16:9', '1:1', '4:3', '3:4', '9:16'],
    auth: 'api_key'
  },
  dalle3: {
    endpoint: 'https://api.openai.com/v1/images/generations',
    pricing: { standard: 0.040, hd: 0.080 },
    formats: ['1024x1024', '1792x1024', '1024x1792'],
    auth: 'bearer_token'
  },
  midjourney: {
    endpoint: 'https://api.midjourney.com/v1/generate',
    pricing: { credits: 1 },
    formats: ['--ar 16:9', '--ar 1:1', '--ar 4:3'],
    auth: 'api_key'
  }
};

export async function generateImage(provider, prompt, options = {}) {
  const config = IMAGE_PROVIDERS[provider];
  const formattedPrompt = adaptPromptForImage(provider, prompt);
  
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${options.apiKey}`
    },
    body: JSON.stringify({
      prompt: formattedPrompt,
      ...options
    })
  });
  
  return {
    imageUrl: result.url || result.images?.[0]?.url,
    provider,
    cost: config.pricing,
    metadata: {
      prompt: formattedPrompt,
      dimensions: options.size,
      generatedAt: new Date().toISOString()
    }
  };
}
```

### Prompt-Adaption pro Provider

```javascript
function adaptPromptForImage(provider, basePrompt) {
  switch (provider) {
    case 'midjourney':
      return `${basePrompt.description}, ${basePrompt.style} --ar ${basePrompt.aspect} --v 6.0`;
    
    case 'dalle3':
      return `Create a highly detailed image: ${basePrompt.description}. Style: ${basePrompt.style}. Format: ${basePrompt.aspect}`;
    
    case 'stability':
      return `${basePrompt.description}, ${basePrompt.style}, ${basePrompt.quality_keywords}`;
  }
}
```

---

## 4. Monetarisierungs-Modell

### Pricing-Tiers

| Tier | Preis | Features | Image Credits | Marge |
|------|-------|----------|---------------|-------|
| **Free** | €0 | Prompt-Generator, Quality Score | 5 Bilder/Monat (SD) | -€0.02/User |
| **Pro** | €19/Monat | Alle Prompts, API-Zugang | 100 Bilder (DALL-E 3) | €14.60/User |
| **Studio** | €49/Monat | Commercial License, Priority | 500 Bilder (Midjourney/SDXL) | €44.25/User |
| **Agency** | €149/Monat | White-Label, Team (5 User) | 2000 Bilder + API | €139/User |
| **Enterprise** | Custom | On-Premise, Custom Models | Unlimited | 95%+ |

### Revenue-Projektion (Beispiel)

```
Monatliche Einnahmen (bei 100 Usern):
  Free:     50 User × €0    = €0
  Pro:      30 User × €19   = €570
  Studio:   15 User × €49   = €735
  Agency:    4 User × €149  = €596
  Enterprise:1 User × €500  = €500
  ─────────────────────────────────
  Total:                    €2,401/Monat

Kosten (Image Generation):
  Stability: 5000 × $0.0035 = $17.50 (~€16)
  DALL-E 3:  3000 × $0.04   = $120   (~€110)
  Hosting/Payment:           ~€100
  ─────────────────────────────────
  Total Costs:               ~€226

Brutto-Marge: €2,175/Monat (91%)
```

---

## 5. Sprint-Plan (8 Wochen)

### Sprint 5: Image Generation Core (Woche 1-2)
- [ ] Stability AI API-Wrapper
- [ ] Prompt-Adaption für Bild-KIs
- [ ] Image Gallery im UI
- [ ] Download-Funktion
- [ ] Tests: 40+ Image-Gen Tests

### Sprint 6: Multi-Provider (Woche 3-4)
- [ ] DALL-E 3 Integration
- [ ] Midjourney (Discord-Bot oder Proxy)
- [ ] Provider-Vergleich im UI
- [ ] Cost-Tracking pro Bild

### Sprint 7: Payment & Tiers (Woche 5-6)
- [ ] Stripe Integration
- [ ] Credit-System (1 Credit = 1 Bild)
- [ ] Usage-Limits pro Tier
- [ ] Upgrade-Flow

### Sprint 8: Commercial Features (Woche 7-8)
- [ ] Commercial License Toggle
- [ ] Model Release für Training
- [ ] White-Label Dashboard
- [ ] API-Key Management

---

## 6. Rechtliche Aspekte

### Commercial Use Rights

| Provider | Commercial Use | Attribution | Restrictions |
|----------|---------------|-------------|--------------|
| **DALL-E 3** | ✅ Ja | Nicht required | Keine ILPs von Marken |
| **Midjourney** | ✅ Ja (Paid Plan) | Nicht required | <$1M Revenue Limit |
| **Stable Diffusion** | ✅ Ja (Open License) | Optional | Keine illegalen Inhalte |
| **Adobe Firefly** | ✅ Ja (Commercial Safe) | Inklusiv | Adobe Stock only |
| **Leonardo** | ✅ Ja | Required | Platform-bound |

### Empfehlungen
- **Stability AI** für Free-Tier (open license, günstig)
- **DALL-E 3** für Pro-Tier (beste Qualität)
- **Adobe Firefly** für Enterprise (copyright-safe)

---

## 7. Go-to-Market

### Phase 1: Beta Launch (Monat 1)
- Stability AI Integration
- 100 Beta-Tester (Free)
- Feedback sammeln

### Phase 2: Paid Launch (Monat 2-3)
- Stripe Integration
- Pro & Studio Tiers
- Product Hunt Launch

### Phase 3: Scale (Monat 4-6)
- Multi-Provider
- API für Developer
- Affiliate Programm (30% Commission)

### Phase 4: Enterprise (Monat 6+)
- White-Label
- Custom Fine-Tuning
- On-Premise Deployment

---

## 8. Competitive Advantage

**PromptForge vs. reine Image-Generatoren:**

| Feature | PromptForge | Midjourney | DALL-E | Leonardo |
|---------|-------------|------------|--------|----------|
| Prompt-Quality-Scoring | ✅ | ❌ | ❌ | ❌ |
| Multi-Provider | ✅ | ❌ | ❌ | ❌ |
| Intent Detection | ✅ | ❌ | ❌ | ❌ |
| Commercial License | ✅ | ⚠️ Limited | ✅ | ⚠️ |
| Prompt Library | ✅ | ❌ | ❌ | ❌ |
| Cost Comparison | ✅ | ❌ | ❌ | ❌ |
| A/B Testing | ✅ | ❌ | ❌ | ❌ |

**USP:** 
> *"Der einzige Prompt-Generator mit Quality-Scoring + Multi-Provider Image Generation + Commercial Licensing"*

---

## 9. Nächste Schritte

1. [ ] **Stability AI API Key** besorgen (kostenlos: https://platform.stability.ai)
2. [ ] **Sprint 5** starten (Image Core)
3. [ ] **Rechtsberatung** für Commercial Licensing
4. [ ] **Beta-Tester** recruitieren (Twitter, Reddit r/StableDiffusion, Discord)

---

## 10. Quickstart: Stability AI Integration

```bash
# 1. API Key holen
https://platform.stability.ai/account/keys

# 2. Test-Call
curl https://api.stability.ai/v2beta/stable-image/generate/sd3 \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Cyberpunk cityscape at night, neon lights, cinematic", "output_format": "webp"}'

# 3. In PromptForge integrieren
npm install @stabilityai/stable-diffusion
```

---

**Dokumentation erstellt:** $(date)
**Status:** Ready for Sprint 5
