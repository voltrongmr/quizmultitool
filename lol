/**
 * AP Networking Quiz Dev Tool
 * Copy and paste this entire script into your browser console to highlight correct answers in green.
 * Visual indicator circle shows which answer is correct!
 */

(function() {
  const HIGHLIGHT_COLOR = '#40FF00'; // Neon green from your theme
  const HIGHLIGHT_BG = 'rgba(64, 255, 0, 0.3)'; // Semi-transparent green background
  
  // Store original styles to restore on reset
  const highlightedElements = new Map();
  
  /**
   * Create and initialize the indicator using existing Lucide grid icon
   */
  function createIndicatorCircle() {
    // Find the existing Lucide grid icon on the page
    const existingGrid = document.querySelector('svg.lucide.lucide-grid');
    
    if (!existingGrid) {
      console.warn('Could not find svg.lucide.lucide-grid element on the page');
      return;
    }
    
    // Store the original SVG for later restoration
    window.quizDevToolOriginalGrid = existingGrid.cloneNode(true);
    
    // Add click handler to the grid
    existingGrid.style.cursor = 'pointer';
    existingGrid.addEventListener('click', (e) => {
      e.stopPropagation();
      existingGrid.style.display = 'none';
      console.log('%c✓ Grid hidden. Run quizDevTool.show() to bring it back.', 'color: #40FF00; font-size: 12px;');
    });
    
    // Add hover effect
    existingGrid.addEventListener('mouseenter', () => {
      existingGrid.innerHTML = '<text x="12" y="16" text-anchor="middle" font-size="16" font-weight="bold" fill="#FF4444" style="pointer-events: none;">×</text>';
      existingGrid.setAttribute('stroke', '#FF4444');
    });
    
    existingGrid.addEventListener('mouseleave', () => {
      // Restore the original grid
      existingGrid.innerHTML = window.quizDevToolOriginalGrid.innerHTML;
      existingGrid.setAttribute('stroke', window.quizDevToolOriginalGrid.getAttribute('stroke'));
      // Re-apply highlight if needed
      updateIndicatorCircle();
    });
  }
  
  /**
   * Update indicator based on which answer is correct
   */
  function updateIndicatorCircle() {
    const answerCards = document.querySelectorAll('.answer-card');
    
    if (answerCards.length === 0) return;
    
    const gridSvg = document.querySelector('svg.lucide.lucide-grid');
    if (!gridSvg) return;
    
    // Get the current question data
    const currentQuestion = getReactState();
    if (!currentQuestion || !currentQuestion.correct) return;
    
    const correctAnswer = currentQuestion.correct;
    
    // Find which position the correct answer is in (0, 1, 2, or 3)
    let correctIndex = -1;
    answerCards.forEach((card, index) => {
      const cardText = card.textContent.trim();
      const correctText = correctAnswer.trim();
      if (cardText === correctText) {
        correctIndex = index;
      }
    });
    
    if (correctIndex === -1) return;
    
    // Get all rect elements in the grid
    const rects = gridSvg.querySelectorAll('rect');
    
    // Clear all highlights first - restore to original stroke
    rects.forEach(rect => {
      rect.setAttribute('stroke', 'currentColor');
      rect.setAttribute('stroke-width', '1.5');
      rect.setAttribute('opacity', '1');
    });
    
    // Highlight the correct answer's rect (0 = first rect, 1 = second, etc)
    if (rects[correctIndex]) {
      rects[correctIndex].setAttribute('opacity', '0.65');
    }
  }
  
  /**
   * Extract React fiber from DOM element to access component state
   */
  function getReactFiber(element) {
    const key = Object.keys(element).find(key => 
      key.startsWith('__react') || key.startsWith('__reactFiber')
    );
    return key ? element[key] : null;
  }
  
  /**
   * Get React component state from fiber tree
   */
  function getReactState() {
    try {
      const rootElement = document.getElementById('root');
      if (!rootElement) return null;
      
      let fiber = getReactFiber(rootElement);
      if (!fiber) return null;
      
      // Traverse the fiber tree to find the App component
      while (fiber) {
        // Look for currentQuestion in the component's state
        if (fiber.memoizedState) {
          let hookState = fiber.memoizedState;
          let hookIndex = 0;
          
          while (hookState) {
            // Check if this hook contains currentQuestion
            if (hookState.memoizedState && hookState.memoizedState.question) {
              return hookState.memoizedState;
            }
            // Check if this is the shuffledAnswers or other relevant state
            if (Array.isArray(hookState.memoizedState)) {
              // Look ahead for currentQuestion
              let tempState = hookState;
              while (tempState) {
                if (tempState.memoizedState && tempState.memoizedState.question) {
                  return tempState.memoizedState;
                }
                tempState = tempState.next;
              }
            }
            hookState = hookState.next;
            hookIndex++;
          }
        }
        
        // Try the alternate fiber (for Concurrent rendering)
        if (fiber.alternate && fiber.alternate.memoizedState) {
          const altState = fiber.alternate.memoizedState;
          let hookState = altState;
          
          while (hookState) {
            if (hookState.memoizedState && hookState.memoizedState.question) {
              return hookState.memoizedState;
            }
            hookState = hookState.next;
          }
        }
        
        fiber = fiber.child;
      }
    } catch (error) {
      console.error('Error accessing React state:', error);
    }
    return null;
  }
  
  /**
   * Main function to highlight correct answers (before submission)
   */
  function highlightCorrectAnswers() {
    // First, try to find the correct answer from React state
    const currentQuestion = getReactState();
    
    if (!currentQuestion || !currentQuestion.correct) {
      return;
    }
    
    // Update the indicator circle
    updateIndicatorCircle();
  }
  
  /**
   * Apply highlight styling to an element
   */
  function highlightElement(element) {
    if (highlightedElements.has(element)) {
      return; // Already highlighted
    }
    
    // Store original styles
    const originalStyles = {
      color: element.style.color,
      backgroundColor: element.style.backgroundColor,
      boxShadow: element.style.boxShadow,
      border: element.style.border
    };
    
    highlightedElements.set(element, originalStyles);
    
    // Apply highlight styles
    element.style.color = HIGHLIGHT_COLOR;
    element.style.backgroundColor = HIGHLIGHT_BG;
    element.style.boxShadow = `0 0 15px rgba(64, 255, 0, 0.8), inset 0 0 10px rgba(64, 255, 0, 0.3)`;
    element.style.border = `3px solid ${HIGHLIGHT_COLOR}`;
    element.style.fontWeight = 'bold';
    element.style.transition = 'all 0.3s ease';
  }
  
  /**
   * Reset all highlights
   */
  function resetHighlights() {
    highlightedElements.forEach((originalStyles, element) => {
      element.style.color = originalStyles.color;
      element.style.backgroundColor = originalStyles.backgroundColor;
      element.style.boxShadow = originalStyles.boxShadow;
      element.style.border = originalStyles.border;
      element.style.fontWeight = '';
    });
    
    highlightedElements.clear();
    
    // Reset indicator
    const gridSvg = document.querySelector('svg.lucide.lucide-grid');
    if (gridSvg) {
      const rects = gridSvg.querySelectorAll('rect');
      rects.forEach(rect => {
        rect.setAttribute('fill', 'none');
        rect.setAttribute('stroke-width', '1.5');
      });
    }
    
    console.log('%c✓ All highlights removed', 'color: #FA37FF; font-size: 12px;');
  }
  
  /**
   * Auto-watch for new questions and highlight answers
   */
  function startAutoWatch() {
    // Check every time the DOM changes or page updates
    const observer = new MutationObserver(() => {
      // Small delay to let React render
      setTimeout(() => {
        highlightCorrectAnswers();
      }, 100);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    // Also check periodically in case mutations are missed
    setInterval(() => {
      highlightCorrectAnswers();
    }, 500);
    
    console.log('%c✓ Auto-watch enabled - grid highlighting ready!', 'color: #40FF00; font-size: 12px;');
  }
  
  // Expose functions to global scope for manual use
  window.quizDevTool = {
    highlight: highlightCorrectAnswers,
    reset: resetHighlights,
    autoWatch: startAutoWatch,
    show: function() {
      const gridSvg = document.querySelector('svg.lucide.lucide-grid');
      if (gridSvg) {
        gridSvg.style.display = '';
        console.log('%c✓ Grid shown', 'color: #40FF00; font-size: 12px;');
      }
    },
    hide: function() {
      const gridSvg = document.querySelector('svg.lucide.lucide-grid');
      if (gridSvg) {
        gridSvg.style.display = 'none';
        console.log('%c✓ Grid hidden', 'color: #40FF00; font-size: 12px;');
      }
    },
    version: '2.0'
  };
  
  // Create the indicator circle and enable auto-watch
  createIndicatorCircle();
  startAutoWatch();
  
  // Clear console to remove all traces
  console.clear();
})();
