# Safesus Development Roadmap

## ✅ MVP (v1.0) - COMPLETED

### Core Features
- [x] Landing page with product copy
- [x] City list page
- [x] City detail page with map
- [x] Safety zones visualization
- [x] Scam pins and warnings
- [x] Live Mode with geolocation
- [x] User authentication (Google + Email)
- [x] Save cities
- [x] Submit tips (community contributions)
- [x] Admin review page for moderation
- [x] Mobile-first responsive design
- [x] PWA configuration

### Technical
- [x] Next.js 14 with App Router
- [x] TypeScript
- [x] Tailwind CSS + shadcn/ui
- [x] Mapbox GL JS integration
- [x] Supabase (Postgres + PostGIS)
- [x] Supabase Auth
- [x] API routes
- [x] Database schema with RLS
- [x] Seed script for Bangkok

### Pages
- [x] / (Landing)
- [x] /cities (City List)
- [x] /city/[slug] (City Detail)
- [x] /live (Live Mode)
- [x] /submit (Submit Tip)
- [x] /account/saved (Saved Cities)
- [x] /account/requests (Requested Cities)
- [x] /admin/review (Admin Moderation)
- [x] /community (Community Guidelines)
- [x] /privacy (Privacy Policy)
- [x] /terms (Terms of Service)
- [x] /auth/callback (Auth Callback)

---

## 🚧 v1.5 - Enhancements

### Features
- [ ] Safety Pulse Bar (risk indicator for current location)
- [ ] Improved map animations (zone fade-in on load)
- [ ] City request form (instead of placeholder page)
- [ ] User profile page
- [ ] Edit/delete submitted tips
- [ ] Email notifications for tip approvals
- [ ] Offline mode improvements
- [ ] Better empty states
- [ ] Loading skeletons

### Data
- [ ] Complete data for Phuket
- [ ] Complete data for Chiang Mai
- [ ] Complete data for Koh Samui
- [ ] Add more Bangkok zones and pins

### Technical
- [ ] Optimize polygon simplification for faster loads
- [ ] Add Redis caching for API routes
- [ ] Implement rate limiting
- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Performance monitoring
- [ ] SEO optimization (sitemap, structured data)
- [ ] i18n support (EN/TH)

---

## 🔮 v2.0 - AI & Advanced Features

### Ask Safi (AI Assistant)
- [ ] Chat interface
- [ ] Context-aware responses
- [ ] Location-based advice
- [ ] Integration with existing safety data
- [ ] Voice input support

### Enhanced Live Mode
- [ ] Continuous location tracking (opt-in)
- [ ] Route safety assessment
- [ ] Geofencing alerts
- [ ] Historical heatmaps

### Community
- [ ] User reputation system
- [ ] Upvote/downvote on tips
- [ ] Comment on locations
- [ ] Share experiences
- [ ] Travel journals

### Social
- [ ] Share city guides
- [ ] Invite friends
- [ ] Group travel planning
- [ ] Emergency contacts

---

## 🌍 Future Expansion

### Geographic
- [ ] More Thailand cities (Pattaya, Krabi, Ayutthaya)
- [ ] Vietnam (Hanoi, Ho Chi Minh, Da Nang)
- [ ] Cambodia (Phnom Penh, Siem Reap)
- [ ] Malaysia (Kuala Lumpur, Penang)
- [ ] Philippines (Manila, Cebu, Boracay)
- [ ] Indonesia (Bali, Jakarta)

### Partnerships
- [ ] Travel insurance integration
- [ ] Hotel/accommodation safety ratings
- [ ] Emergency services API
- [ ] Tourist police hotlines
- [ ] Local guide network

### Monetization (Optional)
- [ ] Premium features (advanced analytics, priority support)
- [ ] B2B API for travel companies
- [ ] Sponsored safe zones (hotels, cafes)
- [ ] Travel insurance affiliate

---

## 🐛 Known Issues

- [ ] Map performance on older devices
- [ ] Service worker caching strategy needs refinement
- [ ] Some TypeScript strict mode violations
- [ ] Mobile browser back button behavior in Live Mode
- [ ] Polygon rendering overlaps in some zones

---

## 📝 Notes

- Keep MVP focus on safety, not features
- Avoid feature creep - launch first, iterate later
- Prioritize mobile experience always
- Keep calm tone in all copy - no fear-mongering
- Community trust is paramount
- Privacy-first always

---

**Last Updated**: October 19, 2025

