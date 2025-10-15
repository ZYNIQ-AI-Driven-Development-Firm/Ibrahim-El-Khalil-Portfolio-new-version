# Pre-Deployment Checklist

## ✅ Code Review & Quality

- [ ] All tests passing
- [ ] No console errors in browser
- [ ] AI Chat working properly
- [ ] Theme customization functional
- [ ] All CRUD operations tested
- [ ] Mobile responsive design verified
- [ ] Cross-browser compatibility checked

## ✅ Environment Variables

### Root .env
- [ ] MONGO_ROOT_USERNAME set
- [ ] MONGO_ROOT_PASSWORD set (strong password)
- [ ] DATABASE_NAME configured
- [ ] GEMINI_API_KEY added

### Frontend .env
- [ ] REACT_APP_GEMINI_API_KEY set
- [ ] REACT_APP_BACKEND_URL pointing to production

### Verify No Secrets in Code
- [ ] No hardcoded API keys in source code
- [ ] No passwords in configuration files
- [ ] .env files in .gitignore
- [ ] Check: `git log --all -p | grep -i "api_key\|password\|secret"`

## ✅ Google Cloud Platform Setup

### Project Configuration
- [ ] GCP project created
- [ ] Billing account linked
- [ ] Project ID noted: ________________

### APIs Enabled
```bash
gcloud services list --enabled
```
- [ ] Cloud Run API
- [ ] Cloud Build API
- [ ] Container Registry API
- [ ] Compute Engine API
- [ ] IAM API

### Service Account
- [ ] Service account created
- [ ] Roles assigned (Run Admin, Storage Admin, Service Account User)
- [ ] JSON key downloaded
- [ ] Key stored securely

## ✅ MongoDB Setup

### MongoDB Atlas (Recommended)
- [ ] Cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Test connection: `mongosh "your_connection_string"`

### Alternative: Local MongoDB for Testing
- [ ] MongoDB running locally
- [ ] Data migrated
- [ ] Backup created

## ✅ GitHub Repository Setup

### Secrets Configuration
Go to: Settings → Secrets and variables → Actions

- [ ] GCP_PROJECT_ID: `your-project-id`
- [ ] GCP_SA_KEY: `base64-encoded-service-account-key`
- [ ] GEMINI_API_KEY: `your-gemini-key`
- [ ] MONGO_URL: `mongodb+srv://...`

### Verify Secrets
```bash
gh secret list
```

### Workflow File
- [ ] `.github/workflows/deploy.yml` exists
- [ ] Workflow syntax validated
- [ ] Test workflow: Push to test branch first

## ✅ Docker Images

### Test Build Locally
```bash
# Backend
cd backend
docker build -t test-backend .
docker run -p 8001:8001 test-backend

# Frontend
cd ../frontend
docker build -t test-frontend --build-arg GEMINI_API_KEY=test .
docker run -p 3000:80 test-frontend
```

- [ ] Backend builds successfully
- [ ] Frontend builds successfully
- [ ] Backend runs without errors
- [ ] Frontend serves correctly

## ✅ Domain Configuration

### DNS Provider Access
- [ ] Access to khalilpreview.space DNS settings
- [ ] Note nameservers: ________________

### Domain Verification
- [ ] Domain ownership verified in GCP
- [ ] TXT record added for verification
- [ ] Verification confirmed

### SSL Certificate
- [ ] SSL certificate provisioned automatically by Cloud Run
- [ ] HTTPS redirect enabled

## ✅ Initial Deployment

### Manual Deployment Test
```bash
# Run the deployment script
chmod +x deploy.sh
./deploy.sh
```

- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Backend URL accessible
- [ ] Frontend URL accessible
- [ ] API documentation accessible at /docs

### Health Checks
```bash
# Backend health
curl https://your-backend-url.run.app/api/health

# Frontend
curl https://your-frontend-url.run.app
```

- [ ] Backend health check returns 200
- [ ] Frontend returns HTML

## ✅ Data Migration

### Prepare Data
- [ ] Review migration scripts
- [ ] Backup current data if any
- [ ] Update connection strings in scripts

### Execute Migration
```bash
python migrate_data.py
```

- [ ] Profile data migrated
- [ ] Experience data migrated
- [ ] Education data migrated
- [ ] Skills data migrated
- [ ] Ventures data migrated
- [ ] Achievements data migrated

### Verify Migration
```bash
curl https://your-backend-url.run.app/api/profile
curl https://your-backend-url.run.app/api/experience
```

- [ ] All endpoints return data
- [ ] Data displayed correctly on frontend

## ✅ Domain Mapping

### Map Custom Domain
```bash
gcloud run domain-mappings create \
  --service portfolio-frontend \
  --domain khalilpreview.space \
  --region us-central1
```

- [ ] Domain mapping created
- [ ] DNS records noted from GCP

### Update DNS Records

At your domain registrar, add these records:

**Root Domain (khalilpreview.space)**
- [ ] Type: A
- [ ] Name: @
- [ ] Value: [IP from GCP]

**WWW Subdomain**
- [ ] Type: CNAME
- [ ] Name: www
- [ ] Value: ghs.googlehosted.com

**API Subdomain (Optional)**
- [ ] Type: CNAME
- [ ] Name: api
- [ ] Value: ghs.googlehosted.com

### Verify DNS Propagation
```bash
nslookup khalilpreview.space
dig khalilpreview.space
```

- [ ] A record resolves correctly
- [ ] CNAME records resolve correctly
- [ ] Wait 15-30 minutes for propagation

## ✅ Post-Deployment Testing

### Functionality Tests
- [ ] Homepage loads at https://khalilpreview.space
- [ ] Business card displays correctly
- [ ] Navigation works
- [ ] All sections load data from API
- [ ] AI Chat responds to messages
- [ ] Theme customization works
- [ ] Admin dashboard accessible
- [ ] Mobile layout correct

### Performance Tests
```bash
# Use tools like:
lighthouse https://khalilpreview.space
```

- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Images optimized

### Security Tests
- [ ] HTTPS enabled and working
- [ ] No mixed content warnings
- [ ] API keys not exposed in client
- [ ] CORS configured correctly

## ✅ Continuous Deployment

### GitHub Actions Workflow
- [ ] Workflow file committed
- [ ] Test push to main branch
- [ ] GitHub Actions runs successfully
- [ ] Changes deployed automatically

### Test Auto-Deployment
```bash
# Make a small change
echo "# Test" >> README.md
git add .
git commit -m "test: Verify auto-deployment"
git push origin main
```

- [ ] GitHub Actions triggered
- [ ] Build completes successfully
- [ ] Deployment updates automatically
- [ ] Changes visible on live site

## ✅ Monitoring & Logging

### Set Up Monitoring
```bash
gcloud services enable monitoring.googleapis.com
```

- [ ] Cloud Monitoring enabled
- [ ] Log Explorer accessible
- [ ] Alerts configured (optional)

### View Logs
```bash
# Frontend logs
gcloud run logs read portfolio-frontend --region us-central1 --limit 50

# Backend logs
gcloud run logs read portfolio-backend --region us-central1 --limit 50
```

- [ ] Logs accessible
- [ ] No critical errors
- [ ] Request metrics visible

## ✅ Backup & Recovery

### Database Backup
- [ ] MongoDB Atlas automated backups enabled
- [ ] Export current data:
  ```bash
  mongodump --uri="your_connection_string"
  ```
- [ ] Backup stored securely

### Code Backup
- [ ] Git repository up to date
- [ ] All branches pushed
- [ ] Tags for releases created

## ✅ Documentation

### Update Documentation
- [ ] README.md updated with live URLs
- [ ] CLOUD-RUN-DEPLOYMENT.md reviewed
- [ ] Environment variables documented
- [ ] Deployment process documented

### Team Knowledge Transfer
- [ ] Deployment guide shared
- [ ] Access credentials documented
- [ ] Emergency contacts listed

## ✅ Cost Optimization

### Review Configuration
- [ ] Memory allocation appropriate (256Mi frontend, 512Mi backend)
- [ ] CPU allocation correct (1 CPU each)
- [ ] Max instances reasonable (10 each)
- [ ] Min instances set to 0 for cost savings

### Set Up Budget Alerts
```bash
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT \
  --display-name="Portfolio Budget" \
  --budget-amount=50USD
```

- [ ] Budget alert created
- [ ] Email notifications configured

## ✅ Final Checks

### User Acceptance Testing
- [ ] Test all user flows
- [ ] Test on different devices
- [ ] Test on different browsers
- [ ] Get feedback from users

### Performance Baseline
- [ ] Record initial metrics
- [ ] Set performance goals
- [ ] Plan for optimization

### Launch Announcement
- [ ] Social media posts prepared
- [ ] LinkedIn update ready
- [ ] Portfolio link in bio/signature

---

## 🚀 Ready for Launch!

Once all items are checked:

1. Commit this checklist: `git add . && git commit -m "chore: Complete pre-deployment checklist"`
2. Push to main: `git push origin main`
3. Watch deployment: https://github.com/your-username/your-repo/actions
4. Visit your site: https://khalilpreview.space
5. Celebrate! 🎉

---

## Emergency Rollback Procedure

If something goes wrong:

```bash
# Rollback to previous revision
gcloud run services update-traffic portfolio-frontend \
  --region us-central1 \
  --to-revisions PREVIOUS=100

gcloud run services update-traffic portfolio-backend \
  --region us-central1 \
  --to-revisions PREVIOUS=100
```

## Support Contacts

- **GCP Support**: https://console.cloud.google.com/support
- **GitHub Support**: https://support.github.com
- **MongoDB Support**: https://support.mongodb.com

---

**Checklist Last Updated**: October 15, 2025
**Deployment Target**: Google Cloud Run
**Domain**: khalilpreview.space
