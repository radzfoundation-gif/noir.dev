import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Slack, Github, Twitter, Linkedin, Twitch, Figma, Chrome, Dribbble } from "lucide-react";

const TESTIMONIALS = [
    {
        name: "FaizalKasim",
        handle: "@FaizalKasim_UNG",
        platform: "youtube",
        content: "I tested one for the mobile app with my no-code and programming skills and experience. However, the Rocket made it for me perfectly by spending only about 200k tokens. Amazing.",
        color: "bg-[#FF0000]",
        logo: Chrome
    },
    {
        name: "Solopr11",
        handle: "@Solopr11",
        platform: "discord",
        content: "I've been trying out every no-code AI website/app builder you can think of for months. and Rocket is 100x better than anything else.",
        color: "bg-[#5865F2]",
        logo: Slack
    },
    {
        name: "Cris Cafiero",
        handle: "@criscafiero",
        platform: "twitter",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        content: "@rocketdotnet - I've tried replicating this ability to one shot working app it's insane.",
        color: "bg-[#1DA1F2]",
        logo: Twitter
    },
    {
        name: "T-Bot 🤖",
        handle: "@tbot_ai",
        platform: "discord",
        content: "Yesterday I gave a try to what you guys have built... truly magical, beautiful and definitely the best experience I had so far compared to the competitors!!!",
        color: "bg-[#5865F2]",
        logo: Twitch
    },
    {
        name: "Paras Chodavadiya",
        handle: "CTO | Expert in Tailoring User-Centric IT Solutions",
        platform: "linkedin",
        image: "https://randomuser.me/api/portraits/men/45.jpg",
        content: "This platform is a game changer for us and for any IT agency.",
        color: "bg-[#0077B5]",
        logo: Linkedin
    },
    {
        name: "Sean Louis Chioco",
        handle: "@seanchioco",
        platform: "discord",
        content: "I cant' imagine in just 1 simple sentence it will generate me an awesome website or an app. The most amazing part here is the psychology of a landing page that sells is also in the web design without me even explaining anything about it.",
        color: "bg-[#5865F2]",
        logo: Figma
    },
    {
        name: "NoCode AI Builders",
        handle: "@NoCodeAIBuilders",
        platform: "youtube",
        image: "https://randomuser.me/api/portraits/men/22.jpg",
        content: "For me this is the best Nocode AI Builder I have ever used. I built 2 finished apps with it. A user has everything he needs to launch the project.",
        color: "bg-[#FF0000]",
        logo: Dribbble
    },
    {
        name: "Spikel1283",
        handle: "@spikel1283",
        platform: "discord",
        content: "I was creating a mockup of a mobile app for a client. I used the same one shot prompt on Rocket. Rocket blew it away and I was super impressed.",
        color: "bg-[#5865F2]",
        logo: Github
    }
];

export const Testimonials = () => {
    return (
        <section className="py-24 overflow-hidden">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Happiness speaks
                </h2>
                <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
                    What some of our 400K+ creators and developers in 180+ countries building everything from side projects to enterprise apps have to say.
                </p>
            </div>

            <div className="relative w-full">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10"></div>

                {/* Marquee Track 1 - Moving Left */}
                <div className="flex w-max animate-marquee gap-6 hover:[animation-play-state:paused] mb-6">
                    {[...TESTIMONIALS, ...TESTIMONIALS].slice(0, 10).map((item, idx) => (
                        <div
                            key={`row1-${idx}`}
                            className="w-[350px] md:w-[400px] bg-[#434b9d]/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:bg-[#434b9d]/40 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${item.color}`}>
                                            {item.platform === 'youtube' && <i className="fa-brands fa-youtube"></i>}
                                            {item.platform === 'discord' && <i className="fa-brands fa-discord"></i>}
                                            {item.platform === 'twitter' && <i className="fa-brands fa-twitter"></i>}
                                            {!['youtube', 'discord', 'twitter'].includes(item.platform) && item.name[0]}
                                        </div>
                                    )}
                                    <div className="flex flex-col text-left">
                                        <span className="text-white font-semibold text-sm">{item.name}</span>
                                        <span className="text-zinc-400 text-xs truncate max-w-[150px]">{item.handle}</span>
                                    </div>
                                </div>
                                <div className="text-zinc-400">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs ${item.color} shadow-lg`}>
                                        {item.logo && <item.logo size={16} fill="currentColor" className="opacity-90" />}
                                    </div>
                                </div>
                            </div>
                            <p className="text-zinc-200 text-sm leading-relaxed text-left">
                                "{item.content}"
                            </p>
                        </div>
                    ))}
                </div>

                {/* Marquee Track 2 - Moving Right */}
                <div className="flex w-max animate-marquee-reverse gap-6 hover:[animation-play-state:paused]">
                    {[...TESTIMONIALS, ...TESTIMONIALS].reverse().slice(0, 10).map((item, idx) => (
                        <div
                            key={`row2-${idx}`}
                            className="w-[350px] md:w-[400px] bg-[#434b9d]/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:bg-[#434b9d]/40 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${item.color}`}>
                                            {item.platform === 'youtube' && <i className="fa-brands fa-youtube"></i>}
                                            {item.platform === 'discord' && <i className="fa-brands fa-discord"></i>}
                                            {item.platform === 'twitter' && <i className="fa-brands fa-twitter"></i>}
                                            {!['youtube', 'discord', 'twitter'].includes(item.platform) && item.name[0]}
                                        </div>
                                    )}
                                    <div className="flex flex-col text-left">
                                        <span className="text-white font-semibold text-sm">{item.name}</span>
                                        <span className="text-zinc-400 text-xs truncate max-w-[150px]">{item.handle}</span>
                                    </div>
                                </div>
                                <div className="text-zinc-400">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs ${item.color} shadow-lg`}>
                                        {item.logo && <item.logo size={16} fill="currentColor" className="opacity-90" />}
                                    </div>
                                </div>
                            </div>
                            <p className="text-zinc-200 text-sm leading-relaxed text-left">
                                "{item.content}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes marquee-reverse {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .animate-marquee {
                    animation: marquee 50s linear infinite;
                }
                .animate-marquee-reverse {
                    animation: marquee-reverse 50s linear infinite;
                }
            `}</style>
        </section>
    );
};
