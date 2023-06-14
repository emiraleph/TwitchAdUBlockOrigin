//Twitch.tv AD blocker modified by Emir
//This code is designed to be used in conjunction with uBlock Origin
//And additionally it has no external links to ensure the security of users
(function() {
    // Check if we are on the Twitch domain
    if (/(^|\.)twitch\.tv$/.test(document.location.hostname) === false) {
        return; // Exit the function if we are not on Twitch
    }
    try {
        // Configure the 'visibilityState' property of the document
        Object.defineProperty(document, 'visibilityState', {
            get() {
                return 'visible';
            }
        });
        // Configure the 'hidden' property of the document
        Object.defineProperty(document, 'hidden', {
            get() {
                return false;
            }
        });
        // Block events to prevent ad playback
        const block = e => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        };
        // Process events for specific tasks
        const process = e => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            // Perform the specific task on the Twitch player
            doTwitchPlayerTask(false, false, true, false, false);
        };
        // Add blocking to events related to document visibility
        document.addEventListener('visibilitychange', block, true);
        document.addEventListener('webkitvisibilitychange', block, true);
        document.addEventListener('mozvisibilitychange', block, true);
        document.addEventListener('hasFocus', block, true);
        // Configure the 'mozHidden' or 'webkitHidden' property based on the browser
        if (/Firefox/.test(navigator.userAgent)) {
            Object.defineProperty(document, 'mozHidden', {
                get() {
                    return false;
                }
            });
        } else {
            Object.defineProperty(document, 'webkitHidden', {
                get() {
                    return false;
                }
            });
        }
    } catch (err) {}
    window.addEventListener('message', (event) => {
        if (event.source != window) {
            return;
        }
        if (event.data.type && event.data.type == 'SetTwitchAdblockSettings' && event.data.settings) {
            TwitchAdblockSettings = event.data.settings;
        }
    }, false);

    function declareOptions(scope) {
        scope.AdSignifier = 'stitched';                         // Set 'AdSignifier' property to 'stitched'
        scope.ClientID = 'kimne78kx3ncx6brgo4mv6wki5h1ko';      // Set 'ClientID' property
        scope.ClientVersion = 'null';                           // Set 'ClientVersion' property to 'null'
        scope.ClientSession = 'null';                           // Set 'ClientSession' property to 'null'
        scope.PlayerType2 = 'autoplay';                         // Set 'PlayerType2' property to 'autoplay'
        scope.PlayerType3 = 'embed';                            // Set 'PlayerType3' property to 'embed'
        scope.CurrentChannelName = null;                        // Set 'CurrentChannelName' property to null
        scope.UsherParams = null;                               // Set 'UsherParams' property to null
        scope.WasShowingAd = false;                             // Set 'WasShowingAd' property to false
        scope.GQLDeviceID = null;                               // Set 'GQLDeviceID' property to null
        scope.IsSquadStream = false;                            // Set 'IsSquadStream' property to false
        scope.StreamInfos = [];                                 // Set 'StreamInfos' property to an empty array
        scope.StreamInfosByUrl = [];                            // Set 'StreamInfosByUrl' property to an empty array
        scope.MainUrlByUrl = [];                                // Set 'MainUrlByUrl' property to an empty array
        scope.EncodingCacheTimeout = 60000;                     // Set 'EncodingCacheTimeout' property to 60000 you can set another timeOut delay
        scope.DefaultProxyType = null;                          // Set 'DefaultProxyType' property to null
        scope.DefaultForcedQuality = null;                      // Set 'DefaultForcedQuality' property to null
        scope.DefaultProxyQuality = null;                       // Set 'DefaultProxyQuality' property to null
        scope.ClientIntegrityHeader = null;                     // Set 'ClientIntegrityHeader' property to null
        scope.AuthorizationHeader = null;                       // Set 'AuthorizationHeader' property to null
    }
    
    declareOptions(window);
    var TwitchAdblockSettings = {
        BannerVisible: true,
        ForcedQuality: null,
        ProxyType: null,
        ProxyQuality: null,
    };
    var twitchMainWorker = null;
    var adBlockDiv = null;
    var OriginalVideoPlayerQuality = null;
    var IsPlayerAutoQuality = null;
    const oldWorker = window.Worker;
    window.Worker = class Worker extends oldWorker {
        constructor(twitchBlobUrl) {
            if (twitchMainWorker) {
                super(twitchBlobUrl);
                return;
            }
            var jsURL = getWasmWorkerUrl(twitchBlobUrl);
            if (typeof jsURL !== 'string') {
                super(twitchBlobUrl);
                return;
            }
            // Injected functions
            var newBlobStr = `
                ${getStreamUrlForResolution.toString()}         // Concatenating the string representation of the function 'getStreamUrlForResolution'
                ${getStreamForResolution.toString()}            // Concatenating the string representation of the function 'getStreamForResolution'
                ${stripUnusedParams.toString()}                 // Concatenating the string representation of the function 'stripUnusedParams'
                ${processM3U8.toString()}                       // Concatenating the string representation of the function 'processM3U8'
                ${hookWorkerFetch.toString()}                   // Concatenating the string representation of the function 'hookWorkerFetch'
                ${declareOptions.toString()}                    // Concatenating the string representation of the function 'declareOptions'
                ${getAccessToken.toString()}                    // Concatenating the string representation of the function 'getAccessToken'
                ${gqlRequest.toString()}                        // Concatenating the string representation of the function 'gqlRequest'
                ${adRecordgqlPacket.toString()}                 // Concatenating the string representation of the function 'adRecordgqlPacket'
                ${tryNotifyTwitch.toString()}                   // Concatenating the string representation of the function 'tryNotifyTwitch'
                ${parseAttributes.toString()}                   // Concatenating the string representation of the function 'parseAttributes'
                declareOptions(self);
                self.TwitchAdblockSettings = ${JSON.stringify(TwitchAdblockSettings)};
                self.addEventListener('message', function(e) {
                    if (e.data.key == 'UpdateIsSquadStream') {
                        IsSquadStream = e.data.value;
                    } else if (e.data.key == 'UpdateClientVersion') {
                        ClientVersion = e.data.value;
                    } else if (e.data.key == 'UpdateClientSession') {
                        ClientSession = e.data.value;
                    } else if (e.data.key == 'UpdateClientId') {
                        ClientID = e.data.value;
                    } else if (e.data.key == 'UpdateDeviceId') {
                        GQLDeviceID = e.data.value;
                    } else if (e.data.key == 'UpdateClientIntegrityHeader') {
                        ClientIntegrityHeader = e.data.value;
                    } else if (e.data.key == 'UpdateAuthorizationHeader') {
                        AuthorizationHeader = e.data.value;
                    }
                });
                hookWorkerFetch();
                importScripts('${jsURL}');
            `;

             // Create a new blob URL with the modified code
            super(URL.createObjectURL(new Blob([newBlobStr])));
             // Set twitchMainWorker to the current instance
            twitchMainWorker = this;
            // Handle message events for displaying/hiding ad block banner
            this.onmessage = function(e) {
                if (e.data.key == 'ShowAdBlockBanner') {
                    if (!TwitchAdblockSettings.BannerVisible) {
                        return;
                    }
                    if (adBlockDiv == null) {
                        adBlockDiv = getAdBlockDiv();
                    }
                    adBlockDiv.P.textContent = 'Blocking ads';
                    adBlockDiv.style.display = 'block';
                } else if (e.data.key == 'HideAdBlockBanner') {
                    if (adBlockDiv == null) {
                        adBlockDiv = getAdBlockDiv();
                    }
                    adBlockDiv.style.display = 'none';
                } else if (e.data.key == 'PauseResumePlayer') {
                    doTwitchPlayerTask(true, false, false, false, false);
                } else if (e.data.key == 'ForceChangeQuality') {
        /**
        This code block performs the following functionality:

        It attempts to return immediately using the 'return' statement
        It invokes the 'doTwitchPlayerTask' function to retrieve the auto quality and current quality of the Twitch player
        It initializes the global variables 'IsPlayerAutoQuality' and 'OriginalVideoPlayerQuality' if they are null
        It checks if the current quality does not include '360' or if the provided value is not null
        If the original video player quality does not include '360', it attempts to access the settings menu and select the quality menu
        It retrieves the low quality options and selects the second-to-last option
        If the provided value is not null and includes 'original', it assigns the original video player quality to the value
        If the player is set to auto quality, it assigns the value 'auto' to the provided value
        */
                    try {
                            return;
                        var autoQuality = doTwitchPlayerTask(false, false, false, true, false);
                        var currentQuality = doTwitchPlayerTask(false, true, false, false, false);
                        if (IsPlayerAutoQuality == null) {
                            IsPlayerAutoQuality = autoQuality;
                        }
                        if (OriginalVideoPlayerQuality == null) {
                            OriginalVideoPlayerQuality = currentQuality;
                        }
                        if (!currentQuality.includes('360') || e.data.value != null) {
                            if (!OriginalVideoPlayerQuality.includes('360')) {
                                var settingsMenu = document.querySelector('div[data-a-target="player-settings-menu"]');
                                if (settingsMenu == null) {
                                    var settingsCog = document.querySelector('button[data-a-target="player-settings-button"]');
                                    if (settingsCog) {
                                        settingsCog.click();
                                        var qualityMenu = document.querySelector('button[data-a-target="player-settings-menu-item-quality"]');
                                        if (qualityMenu) {
                                            qualityMenu.click();
                                        }
                                        var lowQuality = document.querySelectorAll('input[data-a-target="tw-radio"');
                                        if (lowQuality) {
                                            var qualityToSelect = lowQuality.length - 2;
                                            if (e.data.value != null) {
                                                if (e.data.value.includes('original')) {
                                                    e.data.value = OriginalVideoPlayerQuality;
                                                    if (IsPlayerAutoQuality) {
                                                        e.data.value = 'auto';
                                                    }
        /**
        It checks the provided value and assigns the appropriate quality level to the 'qualityToSelect' variable
        If the value includes '160p', the quality level 5 is assigned
        If the value includes '360p', the quality level 4 is assigned
        If the value includes '480p', the quality level 3 is assigned
        If the value includes '720p', '822p', '864p', '900p', '936p', '960p', or '1080p', the quality level 2 is assigned
        If the value includes 'source', the quality level 1 is assigned
        If the value includes 'auto', the quality level 0 is assigned
        */
                                                }
                                                if (e.data.value.includes('160p')) {
                                                    qualityToSelect = 5;
                                                }
                                                if (e.data.value.includes('360p')) {
                                                    qualityToSelect = 4;
                                                }
                                                if (e.data.value.includes('480p')) {
                                                    qualityToSelect = 3;
                                                }
                                                if (e.data.value.includes('720p')) {
                                                    qualityToSelect = 2;
                                                }
                                                if (e.data.value.includes('822p')) {
                                                    qualityToSelect = 2;
                                                }
                                                if (e.data.value.includes('864p')) {
                                                    qualityToSelect = 2;
                                                }
                                                if (e.data.value.includes('900p')) {
                                                    qualityToSelect = 2;
                                                }
                                                if (e.data.value.includes('936p')) {
                                                    qualityToSelect = 2;
                                                }
                                                if (e.data.value.includes('960p')) {
                                                    qualityToSelect = 2;
                                                }
                                                if (e.data.value.includes('1080p')) {
                                                    qualityToSelect = 2;
                                                }
                                                if (e.data.value.includes('source')) {
                                                    qualityToSelect = 1;
                                                }
                                                if (e.data.value.includes('auto')) {
                                                    qualityToSelect = 0;
                                                }
                                            }
                                            var currentQualityLS = window.localStorage.getItem('video-quality');
                                            lowQuality[qualityToSelect].click();
                                            settingsCog.click();
                                            window.localStorage.setItem('video-quality', currentQualityLS);
                                            if (e.data.value != null) {
                                                OriginalVideoPlayerQuality = null;
                                                IsPlayerAutoQuality = null;
                                                doTwitchPlayerTask(false, false, false, true, true);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        OriginalVideoPlayerQuality = null;
                        IsPlayerAutoQuality = null;
                    }
                }
            };

        /**
        This function retrieves the ad block div element from the video player
        It performs the following steps:

        Finds the root div element of the video player with the class 'video-player'
        Checks if the ad block div element is present within the player root div
        If found, assigns the reference to the 'adBlockDiv' variable
        If not found, creates a new ad block div element, sets its class and inner HTML, and appends it to the player root div
        Returns the reference to the ad block div element
        */
            function getAdBlockDiv() {
                var playerRootDiv = document.querySelector('.video-player');
                var adBlockDiv = null;
                if (playerRootDiv != null) {
                    adBlockDiv = playerRootDiv.querySelector('.adblock-overlay');
                    if (adBlockDiv == null) {
                        adBlockDiv = document.createElement('div');
                        adBlockDiv.className = 'adblock-overlay';
                        adBlockDiv.innerHTML = '<div class="player-adblock-notice" style="color: white; background-color: rgba(0, 0, 0, 0.8); position: absolute; top: 0px; left: 0px; padding: 5px;"><p></p></div>';
                        adBlockDiv.style.display = 'none';
                        adBlockDiv.P = adBlockDiv.querySelector('p');
                        playerRootDiv.appendChild(adBlockDiv);
                    }
                }
                return adBlockDiv;
            }
        }
    };
    // This function retrieves the URL of the WebAssembly worker script from the Twitch blob URL.
function getWasmWorkerUrl(twitchBlobUrl) {
    var req = new XMLHttpRequest();
    req.open('GET', twitchBlobUrl, false);
    req.send();
    return req.responseText.split("'")[1]; // Extracts the WebAssembly worker URL from the response text
}

// This function hooks into the fetch function to intercept and process requests made by the Twitch player.
function hookWorkerFetch() {
    console.log('Twitch adblocker is enabled');
    var realFetch = fetch; // Stores the original fetch function

    // Overrides the global fetch function with a new async function
    fetch = async function(url, options) {
        if (typeof url === 'string') {
            if (url.includes('video-weaver')) { // Checks if it's a video request
                return new Promise(function(resolve, reject) {
                    // Creates a Promise to handle the request and process the M3U8 response
                    var processAfter = async function(response) {
                        var responseText = await response.text();
                        var weaverText = null;

                        // Processes the M3U8 response using the 'processM3U8' function
                        weaverText = await processM3U8(url, responseText, realFetch, PlayerType2);

                        if (weaverText.includes(AdSignifier)) {
                            // If the processed text contains the 'AdSignifier', process again with 'PlayerType3'
                            weaverText = await processM3U8(url, responseText, realFetch, PlayerType3);
                        }

                        resolve(new Response(weaverText)); // Resolves the Promise with the processed response
                    };

                    var send = function() {
                        return realFetch(url, options).then(function(response) {
                            processAfter(response);
                        }).catch(function(err) {
                            reject(err);
                        });
                    };

                    send();
                });
            } else if (url.includes('/api/channel/hls/')) { // Checks if it's a channel request
                var channelName = (new URL(url)).pathname.match(/([^\/]+)(?=\.\w+$)/)[0];
                UsherParams = (new URL(url)).search;
                CurrentChannelName = channelName;

                return new Promise(function(resolve, reject) {
                    // Creates a Promise to handle the request and process the M3U8 response
                    var processAfter = async function(response) {
                        if (response.status == 200) {
                            var encodingsM3u8 = await response.text();
                            var streamInfo = StreamInfos[channelName];

                            if (streamInfo == null) {
                                StreamInfos[channelName] = streamInfo = {};
                            }

                            streamInfo.ChannelName = channelName;
                            streamInfo.Urls = [];
                            streamInfo.EncodingsM3U8Cache = [];
                            streamInfo.EncodingsM3U8 = encodingsM3u8;

                            // Parses the M3U8 response and stores relevant information in StreamInfos and related objects
                            var lines = encodingsM3u8.replace('\r', '').split('\n');
                            for (var i = 0; i < lines.length; i++) {
                                if (!lines[i].startsWith('#') && lines[i].includes('.m3u8')) {
                                    streamInfo.Urls[lines[i]] = -1;

                                    if (i > 0 && lines[i - 1].startsWith('#EXT-X-STREAM-INF')) {
                                        var attributes = parseAttributes(lines[i - 1]);
                                        var resolution = attributes['RESOLUTION'];
                                        var frameRate = attributes['FRAME-RATE'];

                                        if (resolution) {
                                            streamInfo.Urls[lines[i]] = {
                                                Resolution: resolution,
                                                FrameRate: frameRate
                                            };
                                        }
                                    }
                                    StreamInfosByUrl[lines[i]] = streamInfo;
                                    MainUrlByUrl[lines[i]] = url;
                                }
                            }

                            resolve(new Response(encodingsM3u8)); // Resolves the Promise with the response
                        } else {
                            resolve(response);
                        }
                    };

                    var send = function() {
                        return realFetch(url, options).then(function(response) {
                            processAfter(response);
                        }).catch(function(err) {
                            reject(err);
                        });
                    };

                    send();
                });
            }
        }
            return realFetch.apply(this, arguments);
        };
    }
    function getStreamUrlForResolution(encodingsM3u8, resolutionInfo, qualityOverrideStr) {
        var qualityOverride = 0;
        
        // If a quality override string is provided and it ends with 'p', extract the quality override value
        if (qualityOverrideStr && qualityOverrideStr.endsWith('p')) {
            qualityOverride = qualityOverrideStr.substr(0, qualityOverrideStr.length - 1) | 0;
        }
        
        var qualityOverrideFoundQuality = 0;
        var qualityOverrideFoundFrameRate = 0;
        var encodingsLines = encodingsM3u8.replace('\r', '').split('\n');
        var firstUrl = null;
        var lastUrl = null;
        var matchedResolutionUrl = null;
        var matchedFrameRate = false;
        
        for (var i = 0; i < encodingsLines.length; i++) {
            if (!encodingsLines[i].startsWith('#') && encodingsLines[i].includes('.m3u8')) {
                if (i > 0 && encodingsLines[i - 1].startsWith('#EXT-X-STREAM-INF')) {
                    var attributes = parseAttributes(encodingsLines[i - 1]);
                    var resolution = attributes['RESOLUTION'];
                    var frameRate = attributes['FRAME-RATE'];
                    
                    if (resolution) {
                        if (qualityOverride) {
                            var quality = resolution.toLowerCase().split('x')[1];
                            
                            // If the quality matches the quality override value
                            if (quality == qualityOverride) {
                                qualityOverrideFoundQuality = quality;
                                qualityOverrideFoundFrameRate = frameRate;
                                matchedResolutionUrl = encodingsLines[i];
                                
                                // If the frame rate is less than 40, return the matched resolution URL
                                if (frameRate < 40) {
                                    return matchedResolutionUrl;
                                }
                            }
                            // If the quality is less than the quality override value, return the matched resolution URL (if any)
                            else if (quality < qualityOverride) {
                                return matchedResolutionUrl ? matchedResolutionUrl : encodingsLines[i];
                            }
                        }
                        // If no quality override is specified
                        else if ((!resolutionInfo || resolution == resolutionInfo.Resolution) &&
                                 (!matchedResolutionUrl || (!matchedFrameRate && frameRate == resolutionInfo.FrameRate))) {
                            matchedResolutionUrl = encodingsLines[i];
                            matchedFrameRate = frameRate == resolutionInfo.FrameRate;
                            
                            // If the frame rate matches, return the matched resolution URL
                            if (matchedFrameRate) {
                                return matchedResolutionUrl;
                            }
                        }
                    }
                    if (firstUrl == null) {
                        firstUrl = encodingsLines[i];
                    }
                    
                    lastUrl = encodingsLines[i];
                }
            }
        }
        if (qualityOverride) {
            return lastUrl;
        }
        return matchedResolutionUrl ? matchedResolutionUrl : firstUrl;
    }
    async function getStreamForResolution(streamInfo, resolutionInfo, encodingsM3u8, fallbackStreamStr, playerType, realFetch) {
        var qualityOverride = null;
    
        // Determine the quality override based on the player type (proxy or default)
        if (playerType === 'proxy') {
            qualityOverride = TwitchAdblockSettings.ProxyQuality ? TwitchAdblockSettings.ProxyQuality : DefaultProxyQuality;
        }
    
        // Check if the encodings cache needs to be updated or if ads should be blocked
        if (streamInfo.EncodingsM3U8Cache[playerType].Resolution != resolutionInfo.Resolution ||
            streamInfo.EncodingsM3U8Cache[playerType].RequestTime < Date.now() - EncodingCacheTimeout) {
            console.log(`Blocking ads (type: ${playerType}, resolution: ${resolutionInfo.Resolution}, frameRate: ${resolutionInfo.FrameRate}, qualityOverride: ${qualityOverride})`);
        }
    
        // Update the encodings cache with the current request time and values
        streamInfo.EncodingsM3U8Cache[playerType].RequestTime = Date.now();
        streamInfo.EncodingsM3U8Cache[playerType].Value = encodingsM3u8;
        streamInfo.EncodingsM3U8Cache[playerType].Resolution = resolutionInfo.Resolution;
    
        // Get the stream M3U8 URL for the specified resolution and quality override
        var streamM3u8Url = getStreamUrlForResolution(encodingsM3u8, resolutionInfo, qualityOverride);
    
        // Fetch the stream M3U8 file using the realFetch function
        var streamM3u8Response = await realFetch(streamM3u8Url);
    
        if (streamM3u8Response.status == 200) {
            // If the response status is 200 (OK), process the M3U8 text
            var m3u8Text = await streamM3u8Response.text();
    
            // Set the flag indicating that an ad was shown
            WasShowingAd = true;
    
            // Send messages to show the ad block banner and force a quality change
            postMessage({ key: 'ShowAdBlockBanner' });
            postMessage({ key: 'ForceChangeQuality' });
    
            // If the M3U8 text is empty or contains the ad signifier, clear the encodings cache value
            if (!m3u8Text || m3u8Text.includes(AdSignifier)) {
                streamInfo.EncodingsM3U8Cache[playerType].Value = null;
            }
    
            return m3u8Text;
        } else {
            // If the response status is not 200, clear the encodings cache value and return the fallback stream
            streamInfo.EncodingsM3U8Cache[playerType].Value = null;
            return fallbackStreamStr;
        }
    }
    function stripUnusedParams(str, params) {
        // If params is not provided, use default values
        if (!params) {
            params = ['token', 'sig'];
        }
    
        // Create a temporary URL object from the string
        var tempUrl = new URL('' + str);
    
        // Delete the specified parameters from the URL's search params
        for (var i = 0; i < params.length; i++) {
            tempUrl.searchParams.delete(params[i]);
        }
    
        // Return the updated URL string without the deleted params
        return tempUrl.pathname.substring(1) + tempUrl.search;
    }
    
    async function processM3U8(url, textStr, realFetch, playerType) {
        var streamInfo = StreamInfosByUrl[url];
    
        // If it's a squad stream, return the text as is
        if (IsSquadStream == true) {
            return textStr;
        }
    
        // If the text is empty, return it as is
        if (!textStr) {
            return textStr;
        }
    
        // If the text doesn't contain '.ts' or '.mp4', return it as is
        if (!textStr.includes('.ts') && !textStr.includes('.mp4')) {
            return textStr;
        }
    
        // Check if the text has ad tags
        var haveAdTags = textStr.includes(AdSignifier);
    
        if (haveAdTags) {
            var isMidroll = textStr.includes('"MIDROLL"') || textStr.includes('"midroll"');
    
            // If it's not a midroll ad, perform some action (try-catch block is empty)
            if (!isMidroll) {
                try {
                    // TODO: Add code here
                } catch (err) {
                    // TODO: Add error handling here
                }
            }
    
            var currentResolution = null;
    
            // Get the current resolution info from the streamInfo object
            if (streamInfo && streamInfo.Urls) {
                for (const [resUrl, resInfo] of Object.entries(streamInfo.Urls)) {
                    if (resUrl == url) {
                        currentResolution = resInfo;
                        break;
                    }
                }
            }
    
            var encodingsM3U8Cache = streamInfo.EncodingsM3U8Cache[playerType];
    
            if (encodingsM3U8Cache) {
                // Check if the encodings cache is valid and retrieve the stream for the current resolution
                if (encodingsM3U8Cache.Value && encodingsM3U8Cache.RequestTime >= Date.now() - EncodingCacheTimeout) {
                    try {
                        var result = getStreamForResolution(streamInfo, currentResolution, encodingsM3U8Cache.Value, null, playerType, realFetch);
                        if (result) {
                            return result;
                        }
                    } catch (err) {
                        encodingsM3U8Cache.Value = null;
                    }
                }
            } else {
                // Initialize the encodings cache if it doesn't exist
                streamInfo.EncodingsM3U8Cache[playerType] = {
                    RequestTime: Date.now(),
                    Value: null,
                    Resolution: null
                };
            }
    
            if (playerType === 'proxy') {
                try {
                    var proxyType = TwitchAdblockSettings.ProxyType ? TwitchAdblockSettings.ProxyType : DefaultProxyType;
                    var encodingsM3u8Response = null;
    
                    // Perform different fetch requests based on the proxy type
                    switch (proxyType) {
                        case '1':
                            encodingsM3u8Response = await realFetch('' + CurrentChannelName + '.m3u8%3Fallow_source%3Dtrue', { headers: { '': '' } });
                            break;
                        case '2':
                            encodingsM3u8Response = await realFetch('' + CurrentChannelName + '.m3u8?allow_source=true');
                            break;
                    }
    
                    if (encodingsM3u8Response && encodingsM3u8Response.status === 200) {
                        return getStreamForResolution(streamInfo, currentResolution, await encodingsM3u8Response.text(), textStr, playerType, realFetch);
                    }
                } catch (err) {
                    // TODO: Add error handling here
                }
    
                return textStr;
            }
    
            var accessTokenResponse = await getAccessToken(CurrentChannelName, playerType);
    
            if (accessTokenResponse.status === 200) {
                var accessToken = await accessTokenResponse.json();
    
                try {
                    var urlInfo = new URL('https://usher.ttvnw.net/api/channel/hls/' + CurrentChannelName + '.m3u8' + UsherParams);
                    urlInfo.searchParams.set('sig', accessToken.data.streamPlaybackAccessToken.signature);
                    urlInfo.searchParams.set('token', accessToken.data.streamPlaybackAccessToken.value);
                    var encodingsM3u8Response = await realFetch(urlInfo.href);
    
                    if (encodingsM3u8Response.status === 200) {
                        return getStreamForResolution(streamInfo, currentResolution, await encodingsM3u8Response.text(), textStr, playerType, realFetch);
                    } else {
                        return textStr;
                    }
                } catch (err) {
                    // TODO: Add error handling here
                }
    
                return textStr;
            } else {
                return textStr;
            }
        } else {
            if (WasShowingAd) {
                console.log('Finished blocking ads');
                WasShowingAd = false;
    
                // Send messages to force a quality change, pause/resume player, and hide the ad block banner
                postMessage({
                    key: 'ForceChangeQuality',
                    value: 'original'
                });
                postMessage({
                    key: 'PauseResumePlayer'
                });
                postMessage({
                    key: 'HideAdBlockBanner'
                });
            }
    
            return textStr;
        }
    
        return textStr;
    }
    
    function parseAttributes(str) {
        // Split the string into key-value pairs and convert it into an object
        return Object.fromEntries(
            str.split(/(?:^|,)((?:[^=]*)=(?:"[^"]*"|[^,]*))/)
                .filter(Boolean)
                .map(x => {
                    const idx = x.indexOf('=');
                    const key = x.substring(0, idx);
                    const value = x.substring(idx + 1);
                    const num = Number(value);
                    return [key, Number.isNaN(num) ? value.startsWith('"') ? JSON.parse(value) : value : num];
                })
        );
    }
    async function tryNotifyTwitch(streamM3u8) {
        // Match the stitched ad in the streamM3u8 string
        var matches = streamM3u8.match(/#EXT-X-DATERANGE:(ID="stitched-ad-[^\n]+)\n/);
        // Check if there is a match
        if (matches.length > 1) {
            // Extract relevant attributes from the matched string
                const attrString = matches[1];
                const attr = parseAttributes(attrString);
                var podLength = parseInt(attr['X-TV-TWITCH-AD-POD-LENGTH'] ? attr['X-TV-TWITCH-AD-POD-LENGTH'] : '1');
                var podPosition = parseInt(attr['X-TV-TWITCH-AD-POD-POSITION'] ? attr['X-TV-TWITCH-AD-POD-POSITION'] : '0');
                var radToken = attr['X-TV-TWITCH-AD-RADS-TOKEN'];
                var lineItemId = attr['X-TV-TWITCH-AD-LINE-ITEM-ID'];
                var orderId = attr['X-TV-TWITCH-AD-ORDER-ID'];
                var creativeId = attr['X-TV-TWITCH-AD-CREATIVE-ID'];
                var adId = attr['X-TV-TWITCH-AD-ADVERTISER-ID'];
                var rollType = attr['X-TV-TWITCH-AD-ROLL-TYPE'].toLowerCase();

                 // Create a base data object with the extracted attributes
                const baseData = {
                    stitched: true,
                    roll_type: rollType,
                    player_mute: true,
                    player_volume: 0.0,
                    visible: false,
                    // Additional attributes can be added here
            };
            // Perform further actions with the baseData object
            // ...
            for (let podPosition = 0; podPosition < podLength; podPosition++) {
                const extendedData = {
                    ...baseData,
                    ad_id: adId,
                    ad_position: podPosition,
                    duration: 0,
                    creative_id: creativeId,
                    total_ads: podLength,
                    order_id: orderId,
                    line_item_id: lineItemId,
                };
                await gqlRequest(adRecordgqlPacket('video_ad_impression', radToken, extendedData));
                for (let quartile = 0; quartile < 4; quartile++) {
                    await gqlRequest(
                        adRecordgqlPacket('video_ad_quartile_complete', radToken, {
                            ...extendedData,
                            quartile: quartile + 1,
                        })
                    );
                }
                await gqlRequest(adRecordgqlPacket('video_ad_pod_complete', radToken, baseData));
            }
        }
    }

    /**
    * Function to generate the adRecord GraphQL packet.
    *
    * @param {string} event     - Event name.
    * @param {string} radToken  - RAD token.
    * @param {object} payload   - Event payload.
    * @returns {array}          - Array containing the adRecord GraphQL packet.
    */

    function adRecordgqlPacket(event, radToken, payload) {
        return [{
            operationName: 'ClientSideAdEventHandling_RecordAdEvent',
            variables: {
                input: {
                    eventName: event,
                    eventPayload: JSON.stringify(payload),
                    radToken,
                },
            },
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: '7e6c69e6eb59f8ccb97ab73686f3d8b7d85a72a0298745ccd8bfc68e4054ca5b',
                },
            },
        }];
    }

    /**
    * Function to get the access token.
    *
    * @param {string} channelName   - Channel name.
    * @param {string} playerType    - Player type.
    * @param {function} realFetch   - Real HTTP request function.
    * @returns {Promise}            - Promise that resolves with the access token.
    */

    function getAccessToken(channelName, playerType, realFetch) {
        var body = null;
        var templateQuery = 'query PlaybackAccessToken_Template($login: String!, $isLive: Boolean!, $vodID: ID!, $isVod: Boolean!, $playerType: String!) {  streamPlaybackAccessToken(channelName: $login, params: {platform: "ios", playerBackend: "mediaplayer", playerType: $playerType}) @include(if: $isLive) {    value    signature    __typename  }  videoPlaybackAccessToken(id: $vodID, params: {platform: "ios", playerBackend: "mediaplayer", playerType: $playerType}) @include(if: $isVod) {    value    signature    __typename  }}';
        body = {
            operationName: 'PlaybackAccessToken_Template',
            query: templateQuery,
            variables: {
                'isLive': true,
                'login': channelName,
                'isVod': false,
                'vodID': '',
                'playerType': playerType
            }
        };
        return gqlRequest(body, realFetch);
    }

    /**

    Function to make a GraphQL request.
    @param {Object} body        - The request body.
    @param {function} realFetch - Real HTTP request function.
    @returns {Promise}          - Promise that resolves with the response of the request.
    */

    function gqlRequest(body, realFetch) {
        if (ClientIntegrityHeader == null) {
            console.warn('ClientIntegrityHeader is null');
        }
        var fetchFunc = realFetch ? realFetch : fetch;
        if (!GQLDeviceID) {
            var dcharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            var dcharactersLength = dcharacters.length;
            for (var i = 0; i < 32; i++) {
                GQLDeviceID += dcharacters.charAt(Math.floor(Math.random() * dcharactersLength));
            }
        }
        
return fetchFunc('https://gql.twitch.tv/gql', { // Make an HTTP POST request to the URL determined by fetchFunc
    method: 'POST',                             // Specify the request method as POST
    body: JSON.stringify(body),                 // Convert the body parameter to a JSON string
    headers: {                                  // Set the request headers
        'Client-ID': ClientID,                      // Include the Client-ID header
        'Client-Integrity': ClientIntegrityHeader,  // Include the Client-Integrity header
        'Device-ID': GQLDeviceID,                   // Include the Device-ID header
        'X-Device-Id': GQLDeviceID,                 // Include the X-Device-Id header
        'Client-Version': ClientVersion,            // Include the Client-Version header
        'Client-Session-Id': ClientSession,         // Include the Client-Session-Id header
        'Authorization': AuthorizationHeader        // Include the Authorization header
            }
        });
    }

    /**
 * Perform various tasks related to the Twitch player.
 *
 * @param {boolean} isPausePlay     - Indicates whether to pause and play the player.
 * @param {boolean} isCheckQuality  - Indicates whether to check the video quality.
 * @param {boolean} isCorrectBuffer - Indicates whether to correct the video buffer.
 * @param {boolean} isAutoQuality   - Indicates whether to enable or disable auto quality mode.
 * @param {boolean} setAutoQuality  - Indicates whether to set auto quality mode.
 */
function doTwitchPlayerTask(isPausePlay, isCheckQuality, isCorrectBuffer, isAutoQuality, setAutoQuality) {
    try {
        var videoController = null;
        var videoPlayer = null;

        // Function to find the React node based on a constraint
        function findReactNode(root, constraint) {
            if (root.stateNode && constraint(root.stateNode)) {
                return root.stateNode;
            }
            let node = root.child;
            while (node) {
                const result = findReactNode(node, constraint);
                if (result) {
                    return result;
                }
                node = node.sibling;
            }
            return null;
        }

        var reactRootNode = null;
        var rootNode = document.querySelector('#root');

        // Find the React root node
        if (rootNode && rootNode._reactRootContainer && rootNode._reactRootContainer._internalRoot && rootNode._reactRootContainer._internalRoot.current) {
            reactRootNode = rootNode._reactRootContainer._internalRoot.current;
        }

        // Find the video player instance
        videoPlayer = findReactNode(reactRootNode, node => node.setPlayerActive && node.props && node.props.mediaPlayerInstance);
        videoPlayer = videoPlayer && videoPlayer.props && videoPlayer.props.mediaPlayerInstance ? videoPlayer.props.mediaPlayerInstance : null;

        if (isPausePlay) {
            // Pause and play the video player
            videoPlayer.pause();
            videoPlayer.play();
            return;
        }

        if (isCheckQuality) {
            // Check the video quality
            if (typeof videoPlayer.getQuality() == 'undefined') {
                return;
            }
            var playerQuality = JSON.stringify(videoPlayer.getQuality());
            if (playerQuality) {
                return playerQuality;
            } else {
                return;
            }
        }

        if (isAutoQuality) {
            // Enable or disable auto quality mode
            if (typeof videoPlayer.isAutoQualityMode() == 'undefined') {
                return false;
            }
            var autoQuality = videoPlayer.isAutoQualityMode();
            if (autoQuality) {
                videoPlayer.setAutoQualityMode(false);
                return autoQuality;
            } else {
                return false;
            }
        }

        if (setAutoQuality) {
            // Set auto quality mode
            videoPlayer.setAutoQualityMode(true);
            return;
        }

        try {
            var currentPageURL = document.URL;
            var isLive = true;

            // Check if the current page is a video or clip page
            if (currentPageURL.includes('videos/') || currentPageURL.includes('clip/')) {
                isLive = false;
            }

            if (isCorrectBuffer && isLive) {
                // Correct the video buffer for low latency or high latency
                setTimeout(function() {
                    if (videoPlayer.isLiveLowLatency() && videoPlayer.getLiveLatency() > 5) {
                        videoPlayer.pause();
                        videoPlayer.play();
                    } else if (videoPlayer.getLiveLatency() > 15) {
                        videoPlayer.pause();
                        videoPlayer.play();
                    }
                }, 3000);
            }
        } catch (err) {}
    } catch (err) {}
}
/**
 * This block of code performs various operations related to fetching and modifying requests.
 * It includes the following functionalities:
 * - Retrieves the local device ID from local storage.
 * - Hooks into the `fetch` function to intercept and modify requests.
 * - Updates certain values and headers in the intercepted requests based on specific conditions.
 * - Communicates with the `twitchMainWorker` to send updates related to device ID, client version, client session, client ID, client integrity header, and authorization header.
 * - Modifies the request body for specific conditions.
 * - Handles requests containing 'picture-by-picture'.
 */
var localDeviceID = null;
localDeviceID = window.localStorage.getItem('local_copy_unique_id');

/**
 * Function to hook into the `fetch` function and intercept requests.
 */
function hookFetch() {
    var realFetch = window.fetch;
    window.fetch = function(url, init, ...args) {
        if (typeof url === 'string') {
            // Check if the current URL contains '/squad' and update the 'isSquadStream' flag accordingly
            if (window.location.pathname.includes('/squad')) {
                if (twitchMainWorker) {
                    twitchMainWorker.postMessage({
                        key: 'UpdateIsSquadStream',
                        value: true
                    });
                }
            } else {
                if (twitchMainWorker) {
                    twitchMainWorker.postMessage({
                        key: 'UpdateIsSquadStream',
                        value: false
                    });
                }
            }

            // Update values and headers based on specific conditions in the request
            if (url.includes('/access_token') || url.includes('gql')) {
                var deviceId = init.headers['X-Device-Id'];
                if (typeof deviceId !== 'string') {
                    deviceId = init.headers['Device-ID'];
                }

                // Update the GQLDeviceID based on the device ID header
                if (typeof deviceId === 'string' && !deviceId.includes('twitch-web-wall-mason')) {
                    GQLDeviceID = deviceId;
                } else if (localDeviceID) {
                    GQLDeviceID = localDeviceID.replace('"', '');
                    GQLDeviceID = GQLDeviceID.replace('"', '');
                }

                // Update the X-Device-Id and Device-ID headers in the request
                if (GQLDeviceID && twitchMainWorker) {
                    if (typeof init.headers['X-Device-Id'] === 'string') {
                        init.headers['X-Device-Id'] = GQLDeviceID;
                    }
                    if (typeof init.headers['Device-ID'] === 'string') {
                        init.headers['Device-ID'] = GQLDeviceID;
                    }
                    twitchMainWorker.postMessage({
                        key: 'UpdateDeviceId',
                        value: GQLDeviceID
                    });
                }

                // Update the ClientVersion header in the request
                var clientVersion = init.headers['Client-Version'];
                if (clientVersion && typeof clientVersion == 'string') {
                    ClientVersion = clientVersion;
                }
                if (ClientVersion && twitchMainWorker) {
                    twitchMainWorker.postMessage({
                        key: 'UpdateClientVersion',
                        value: ClientVersion
                    });
                }

                // Update the ClientSession header in the request
                var clientSession = init.headers['Client-Session-Id'];
                if (clientSession && typeof clientSession == 'string') {
                    ClientSession = clientSession;
                }
                if (ClientSession && twitchMainWorker) {
                    twitchMainWorker.postMessage({
                        key: 'UpdateClientSession',
                        value: ClientSession
                    });
                }

                // Update the ClientID, ClientIntegrityHeader, and AuthorizationHeader based on the request body
                if (url.includes('gql') && init && typeof init.body === 'string' && init.body.includes('PlaybackAccessToken')) {
                    var clientId = init.headers['Client-ID'];
                    if (clientId && typeof clientId == 'string') {
                        ClientID = clientId;
                    } else {
                        clientId = init.headers['Client-Id'];
                        if (clientId && typeof clientId == 'string') {
                            ClientID = clientId;
                        }
                    }
                    if (ClientID && twitchMainWorker) {
                        twitchMainWorker.postMessage({
                            key: 'UpdateClientId',
                            value: ClientID
                        });
                    }

                    ClientIntegrityHeader = init.headers['Client-Integrity'];
                    twitchMainWorker.postMessage({
                        key: 'UpdateClientIntegrityHeader',
                        value: init.headers['Client-Integrity']
                    });

                    AuthorizationHeader = init.headers['Authorization'];
                    twitchMainWorker.postMessage({
                        key: 'UpdateAuthorizationHeader',
                        value: init.headers['Authorization']
                    });
                }

                // Modify the request body for specific conditions
                if (url.includes('gql') && init && typeof init.body === 'string' && init.body.includes('PlaybackAccessToken') && init.body.includes('picture-by-picture')) {
                    init.body = '';
                }

                // Handle requests containing 'picture-by-picture'
                var isPBYPRequest = url.includes('picture-by-picture');
                if (isPBYPRequest) {
                    url = '';
                }
            }
        }
        
        // Call the original fetch function with the modified arguments
        return realFetch.apply(this, arguments);
    };
}
// Hook into the fetch function
hookFetch();
})();