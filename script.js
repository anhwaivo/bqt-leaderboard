document.addEventListener("DOMContentLoaded", async () => {
    // Function to determine Elo color class
    function getEloClass(elo) {
        const eloNum = parseFloat(elo);
        if (eloNum >= 2400) return "elo-2400-plus";
        if (eloNum >= 2200) return "elo-2200-2400";
        if (eloNum >= 1900) return "elo-1900-2200";
        if (eloNum >= 1600) return "elo-1600-1900";
        if (eloNum >= 1400) return "elo-1400-1600";
        if (eloNum >= 1200) return "elo-1200-1400";
        if (eloNum >= 0) return "elo-0-1200";
        return "";
    }

    try {
        // Fetch contest history
        const response = await fetch("contest_history.json");
        const data = await response.json();

        // Extract users and their latest Elo ratings
        const users = Object.keys(data).map(username => {
            const history = data[username];
            // Get the latest Elo (from the last contest in history)
            const latestElo = history.length > 0 ? history[history.length - 1].elo : 0;
            return { username, elo: latestElo };
        });

        // Sort users by Elo in descending order
        users.sort((a, b) => b.elo - a.elo);

        // Populate the leaderboard table
        const tbody = document.querySelector("#leaderboard tbody");

        users.forEach((user, index) => {
            const { username, elo } = user;

            const tr = document.createElement("tr");

            // Determine the CSS class and text label based on Elo
            let eloClass = getEloClass(elo);
            let char = "";

            const eloNum = parseFloat(elo);
            if (eloNum >= 2400) char = "[Grandmaster]";
            else if (eloNum >= 2200) char = "[Master]";
            else if (eloNum >= 1900) char = "[Candidate master]";
            else if (eloNum >= 1600) char = "[Expert]";
            else if (eloNum >= 1400) char = "[Specialist]";
            else if (eloNum >= 1200) char = "[Pupil]";
            else if (eloNum >= 0) char = "[Newbie]";

            // Add top-100 class for bold text
            const top100Class = index < 100 ? "elo-top-100" : "";

            // Combine classes for username
            const usernameClassList = [eloClass, top100Class].filter(cls => cls).join(" ");
            // Use eloClass for Elo cell
            const eloClassList = eloClass;

            // Add the text label to the username and wrap in a link
            const formattedUsername = char ? `${username} ${char}` : username;

            // Create clickable username linking to user.html with correct username
            tr.innerHTML = `
                <td class="${usernameClassList}">
                    <a href="user.html?username=${encodeURIComponent(username)}" class="${usernameClassList}">${formattedUsername}</a>
                </td>
                <td class="${eloClassList}">${elo}</td>
            `;

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching or parsing data:", error);
    }

    // Initialize particles.js
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#ffffff'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                }
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#ffffff',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 6,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 400,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });
});
