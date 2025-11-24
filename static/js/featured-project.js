/**
 * Featured Project Card
 * Injects a featured project card below the social icons on the homepage
 */

(function() {
  'use strict';

  // Featured project data
  const featuredProject = {
    title: "AI-Powered Supply Chain Finance",
    description: "60% reduction in lead processing time with AI-powered automation at Yes Bank",
    url: "/projects/supply-chain-finance-lead-management/",
    icon: "🏦" // Bank emoji as thumbnail
  };

  /**
   * Creates the featured project card HTML
   */
  function createFeaturedProjectCard() {
    const container = document.createElement('div');
    container.className = 'featured-project-container';

    container.innerHTML = `
      <div class="featured-project-card">
        <div class="featured-project-header">
          <div class="featured-project-thumbnail">
            ${featuredProject.icon}
          </div>
          <div class="featured-project-content">
            <h3 class="featured-project-title">${featuredProject.title}</h3>
            <p class="featured-project-description">${featuredProject.description}</p>
          </div>
        </div>
        <a href="${featuredProject.url}" class="featured-project-link">
          View Case Study
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
      <div class="view-all-projects">
        <a href="/projects/">View All Projects</a>
      </div>
    `;

    return container;
  }

  /**
   * Injects the featured project card into the page
   */
  function injectFeaturedProjectCard() {
    // Only inject on the homepage
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
      return;
    }

    // Find the profile section
    const profile = document.querySelector('.profile');
    if (!profile) {
      console.warn('Featured Project: Profile section not found');
      return;
    }

    // Find the social icons
    const socialIcons = profile.querySelector('.social-icons');
    if (!socialIcons) {
      console.warn('Featured Project: Social icons not found');
      return;
    }

    // Check if the card already exists
    if (document.querySelector('.featured-project-container')) {
      return;
    }

    // Create and inject the card after social icons
    const card = createFeaturedProjectCard();

    // Insert after the social icons
    if (socialIcons.nextSibling) {
      profile.insertBefore(card, socialIcons.nextSibling);
    } else {
      profile.appendChild(card);
    }
  }

  /**
   * Initialize the featured project card
   */
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectFeaturedProjectCard);
    } else {
      // DOM is already ready
      injectFeaturedProjectCard();
    }
  }

  // Start initialization
  init();
})();
