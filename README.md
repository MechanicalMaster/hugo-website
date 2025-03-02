# Ronak Sethiya's Personal Website

This is my personal website built using Hugo with the PaperMod theme. It serves as a portfolio and blog to showcase my work, thoughts, and experiences.

## 🚀 Features

- Clean and minimal design
- Responsive layout
- Dark/Light mode toggle
- Blog section
- Projects showcase
- Search functionality
- Tag-based organization
- Downloadable CV
- Social media integration

## 🛠️ Tech Stack

- **Framework**: Hugo
- **Theme**: PaperMod (customized)
- **Hosting**: GitHub Pages
- **Version Control**: Git

## 🏗️ Local Development

1. **Prerequisites**
   - Install [Hugo](https://gohugo.io/installation/) (v0.112.4 or higher)
   - Install Git

2. **Clone the repository**
   ```bash
   git clone https://github.com/MechanicalMaster/hugo-website.git
   cd hugo-website
   ```

3. **Run locally**
   ```bash
   hugo server -D
   ```
   The site will be available at http://localhost:1313/

## 📁 Project Structure

```
.(site root)
├── config.yml          # Site configuration
├── content/           
│   ├── posts/         # Blog posts
│   └── projects/      # Project showcases
├── static/            
│   ├── images/        # Images and media
│   └── files/         # Downloadable files (CV, etc.)
└── themes/
    └── PaperMod/      # Theme files
```

## 📝 Content Management

- **Blog Posts**: Add new markdown files to `content/posts/`
- **Projects**: Add new project showcases to `content/projects/`
- **Images**: Store images in `static/images/`
- **Files**: Store downloadable files in `static/files/`

## 🔄 Deployment

This website is deployed on Cloudflare Pages via GitHub Actions.

### Setup for Cloudflare Pages Deployment:

1. **Create a Cloudflare Pages project**:
   - Sign in to your Cloudflare dashboard
   - Go to Pages > Create a project
   - Connect your GitHub repository
   - Configure with the following settings:
     - Build command: `hugo --minify`
     - Build output directory: `public`
     - Set Hugo version environment variable: `HUGO_VERSION` to `0.143.1`

2. **Set up GitHub repository secrets**:
   - Go to your GitHub repository > Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token with Pages edit permission
     - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

3. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

4. The GitHub Actions workflow will automatically build and deploy your site to Cloudflare Pages.

### Custom Domain Setup (Optional):

1. In Cloudflare Pages project settings, go to Custom Domains
2. Add your custom domain
3. Follow the instructions to configure DNS settings

## 📫 Contact

Feel free to reach out to me:
- LinkedIn: [Ronak Sethiya](https://www.linkedin.com/in/ronaksethiya/)
- Email: ronak.sethiya@sjmsom.in
- WhatsApp: Available on request

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
