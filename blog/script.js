function toggleTheme() {
  document.body.classList.toggle('dark');
  // Save the theme preference in a cookie
  const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
  document.cookie = `theme=${theme}; path=/; max-age=31536000`; // Cookie lasts for 1 year
}

// Apply the theme based on the cookie when the page loads
window.onload = function() {
  const cookies = document.cookie.split('; ');
  const themeCookie = cookies.find(cookie => cookie.startsWith('theme='));
  if (themeCookie) {
      const theme = themeCookie.split('=')[1];
      if (theme === 'dark') {
          document.body.classList.add('dark');
      } else {
          document.body.classList.remove('dark');
      }
  }
};

  
  window.onscroll = function() {
    let totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    let scrollPosition = window.scrollY;
    let progress = (scrollPosition / totalHeight) * 1000;
    document.getElementById('reading-progress').style.width = progress + '%';
  };

  document.addEventListener("DOMContentLoaded", function() {
    let tocList = document.getElementById("toc-list");
    let headers = document.querySelectorAll("article h2, article h3, article h4");
  
    headers.forEach(function(header, index) {
      let listItem = document.createElement("li");
      let anchor = document.createElement("a");
      let id = header.textContent.toLowerCase().replace(/\s+/g, '-');

      header.id = id;
      anchor.href = "#" + id;
      anchor.textContent = header.textContent;
      
      listItem.appendChild(anchor);
      tocList.appendChild(listItem);
    });
  });


          // Fetch the .txt file and insert its content as HTML
fetch('https://pranav-sharma.pages.dev/footer.txt')
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.text();
})
.then(data => {
  // Insert the fetched content into the DOM as HTML
  document.getElementById('content').innerHTML = data;
})
.catch(error => {
  console.error('Error fetching the file:', error);
});

fetch('https://pranav-sharma.pages.dev/header.txt')
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.text();
})
.then(data => {
  // Insert the fetched content into the DOM as HTML
  document.getElementById('hcontent').innerHTML = data;
})
.catch(error => {
  console.error('Error fetching the file:', error);
});

document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.querySelector('.scroll-container');
  const scrollContent = document.querySelector('.scroll-content');

  // Create custom scrollbar
  const customScrollbar = document.createElement('div');
  customScrollbar.classList.add('custom-scrollbar');
  scrollContainer.appendChild(customScrollbar);

  const scrollbarThumb = document.createElement('div');
  scrollbarThumb.classList.add('custom-scrollbar-thumb');
  customScrollbar.appendChild(scrollbarThumb);

  const updateScrollbar = () => {
      const scrollRatio = scrollContent.scrollTop / (scrollContent.scrollHeight - scrollContent.clientHeight);
      const thumbHeight = (scrollContent.clientHeight / scrollContent.scrollHeight) * 100;
      scrollbarThumb.style.height = `${thumbHeight}%`;
      scrollbarThumb.style.top = `${scrollRatio * 100}%`;
  };

  scrollContent.addEventListener('scroll', updateScrollbar);

  // Drag functionality for the custom thumb
  let isDragging = false;

  scrollbarThumb.addEventListener('mousedown', (e) => {
      isDragging = true;
      const startY = e.clientY;
      const startScrollTop = scrollContent.scrollTop;

      const onMouseMove = (e) => {
          if (!isDragging) return;
          const delta = e.clientY - startY;
          const scrollHeightRatio = scrollContent.scrollHeight / scrollContent.clientHeight;
          scrollContent.scrollTop = startScrollTop + delta * scrollHeightRatio;
      };

      const onMouseUp = () => {
          isDragging = false;
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
  });

  // Initialize scrollbar position
  updateScrollbar();
});

