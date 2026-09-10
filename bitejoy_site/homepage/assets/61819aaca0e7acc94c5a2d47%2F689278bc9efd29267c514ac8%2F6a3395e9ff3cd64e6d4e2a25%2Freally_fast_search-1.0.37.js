const script = document.createElement('script');
        script.src = 'https://fs-search-embed-staging.pages.dev/finsweet-cmsearch.js';
        script.type = 'module';
        script.defer = true;

        document.head.appendChild(script);

        script.onload = function() {
		                console.log("FinsweetCMSearch loaded");

            try {
                        document.addEventListener('DOMContentLoaded', function() {
            try {
                console.log("FinsweetCMSearch initialized");
            } catch (e) {
                console.error("Error initializing FinsweetCMSearch:", e);
            }
        });;
            } catch (e) {
                console.error("Error initializing FinsweetCMSearch:", e);
            }
        };

        script.onerror = function() {
            console.error("Error loading FinsweetCMSearch script:", e);
        };
        
        window.rfs_instances = [
        [{"input":{"id":"default","name":"Default","placeholder":"Search","openMode":"modal","searchTrigger":"enter","showClearButton":true,"autoFocus":true,"showSearchSuggestionsOnFocus":true,"searchSuggestions":[{"title":"Try \"What is Finsweet?\"","searchString":"What is Finsweet?"},{"title":"Search for \"About our work\"","searchString":"how finsweet helped dropbox?"},{"title":"Checkout \"Our Products\"","searchString":"How to implement consent pro?"}],"animation":"none","searchMode":"cloudflare-semantic"},"results":{"showSearchScore":true,"showThumbnail":true,"showTitle":true,"showDescription":true,"showLink":true,"openInNewTab":true,"searchScore":0.6,"numberOfResults":12,"highLightMatchingKeywords":true,"highlightColor":"yellow","pagination":{"enabled":true,"resultsPerPage":4},"aiOverview":{"enabled":true}}}]
        ]