interface CreditHeroIllustrationProps {
    /** Takvim kartında gösterilecek vade (ay). */
    months: number;
    monthLabel: string;
    className?: string;
}

/**
 * Alışveriş Kredisi tanıtım görseli.
 * Dizüstü, alışveriş çantası, telefon (azalan taksit grafiği), vade takvimi ve
 * madeni paralardan oluşan özgün SVG çizim; gradient zemin üzerinde kullanılmak üzere.
 */
export function CreditHeroIllustration({
    months,
    monthLabel,
    className,
}: CreditHeroIllustrationProps) {
    return (
        <svg
            viewBox="0 0 560 230"
            className={className}
            role="img"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="chi-screen" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#a5b4fc" />
                    <stop offset="1" stopColor="#c4b5fd" />
                </linearGradient>
                <linearGradient id="chi-phone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#eef2ff" />
                    <stop offset="1" stopColor="#e0e7ff" />
                </linearGradient>
                <linearGradient id="chi-bag" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset="1" stopColor="#eef2ff" />
                </linearGradient>
                <linearGradient id="chi-coin" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#fbbf24" />
                    <stop offset="1" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="chi-path" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
                    <stop offset="1" stopColor="#ffffff" stopOpacity="0.22" />
                </linearGradient>
            </defs>

            {/* Arka plan halkaları ve zemin */}
            <circle cx="78" cy="62" r="44" fill="#ffffff" opacity="0.06" />
            <circle cx="508" cy="170" r="52" fill="#ffffff" opacity="0.06" />
            <path
                d="M200 230 L250 120 L310 120 L360 230 Z"
                fill="url(#chi-path)"
            />
            <ellipse
                cx="280"
                cy="214"
                rx="240"
                ry="14"
                fill="#1e1b4b"
                opacity="0.25"
            />

            {/* Dizüstü bilgisayar */}
            <g transform="translate(36 92)">
                <rect
                    x="14"
                    y="0"
                    width="150"
                    height="96"
                    rx="8"
                    fill="#312e81"
                />
                <rect
                    x="21"
                    y="7"
                    width="136"
                    height="82"
                    rx="4"
                    fill="url(#chi-screen)"
                />
                <rect
                    x="31"
                    y="18"
                    width="54"
                    height="8"
                    rx="4"
                    fill="#ffffff"
                    opacity="0.9"
                />
                <rect
                    x="31"
                    y="32"
                    width="86"
                    height="5"
                    rx="2.5"
                    fill="#ffffff"
                    opacity="0.55"
                />
                <rect
                    x="31"
                    y="42"
                    width="70"
                    height="5"
                    rx="2.5"
                    fill="#ffffff"
                    opacity="0.55"
                />
                <rect
                    x="31"
                    y="58"
                    width="44"
                    height="20"
                    rx="5"
                    fill="#4f46e5"
                />
                <rect
                    x="39"
                    y="66"
                    width="28"
                    height="4"
                    rx="2"
                    fill="#ffffff"
                />
                <circle cx="134" cy="66" r="13" fill="#ffffff" opacity="0.85" />
                <path
                    d="M128 66 l4 4 l8 -8"
                    stroke="#4f46e5"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path d="M0 100 H178 L170 112 H8 Z" fill="#c7d2fe" />
                <rect
                    x="74"
                    y="100"
                    width="30"
                    height="4"
                    rx="2"
                    fill="#a5b4fc"
                />
            </g>

            {/* Alışveriş çantası */}
            <g transform="translate(208 38)">
                <path
                    d="M38 40 C38 12 98 12 98 40"
                    stroke="#c7d2fe"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                />
                <path d="M14 40 H122 L132 170 H4 Z" fill="url(#chi-bag)" />
                <path d="M122 40 L144 52 L150 164 L132 170 Z" fill="#c7d2fe" />
                <circle cx="44" cy="58" r="5" fill="#a5b4fc" />
                <circle cx="92" cy="58" r="5" fill="#a5b4fc" />
                {/* Kredi kartı */}
                <g transform="rotate(-8 68 112)">
                    <rect
                        x="22"
                        y="88"
                        width="94"
                        height="58"
                        rx="8"
                        fill="#4f46e5"
                    />
                    <rect
                        x="22"
                        y="100"
                        width="94"
                        height="10"
                        fill="#312e81"
                    />
                    <rect
                        x="32"
                        y="120"
                        width="18"
                        height="13"
                        rx="3"
                        fill="#fbbf24"
                    />
                    <rect
                        x="58"
                        y="124"
                        width="46"
                        height="5"
                        rx="2.5"
                        fill="#ffffff"
                        opacity="0.7"
                    />
                </g>
            </g>

            {/* Yüzde rozeti */}
            <g transform="translate(196 34)">
                <circle cx="22" cy="22" r="22" fill="url(#chi-coin)" />
                <circle
                    cx="22"
                    cy="22"
                    r="17"
                    fill="none"
                    stroke="#ffffff"
                    strokeOpacity="0.5"
                    strokeWidth="2"
                />
                <circle cx="15" cy="15" r="3.5" fill="#78350f" />
                <circle cx="29" cy="29" r="3.5" fill="#78350f" />
                <path
                    d="M30 13 L14 31"
                    stroke="#78350f"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </g>

            {/* Madeni paralar */}
            <g transform="translate(178 168)">
                <ellipse cx="22" cy="34" rx="22" ry="7" fill="#d97706" />
                <rect x="0" y="22" width="44" height="12" fill="#f59e0b" />
                <ellipse cx="22" cy="22" rx="22" ry="7" fill="#d97706" />
                <rect x="0" y="10" width="44" height="12" fill="#fbbf24" />
                <ellipse cx="22" cy="10" rx="22" ry="7" fill="#fcd34d" />
                <text
                    x="22"
                    y="13"
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="700"
                    fill="#92400e"
                >
                    ₺
                </text>
            </g>

            {/* Telefon: azalan aylık taksit grafiği */}
            <g transform="rotate(7 405 120) translate(372 56)">
                <rect
                    x="0"
                    y="0"
                    width="70"
                    height="138"
                    rx="12"
                    fill="#1e1b4b"
                />
                <rect
                    x="5"
                    y="6"
                    width="60"
                    height="126"
                    rx="8"
                    fill="url(#chi-phone)"
                />
                <rect
                    x="25"
                    y="10"
                    width="20"
                    height="4"
                    rx="2"
                    fill="#1e1b4b"
                />
                <rect
                    x="13"
                    y="24"
                    width="30"
                    height="5"
                    rx="2.5"
                    fill="#6366f1"
                />
                <rect
                    x="13"
                    y="34"
                    width="44"
                    height="4"
                    rx="2"
                    fill="#a5b4fc"
                />
                <rect
                    x="13"
                    y="94"
                    width="8"
                    height="26"
                    rx="2"
                    fill="#6366f1"
                />
                <rect
                    x="24"
                    y="100"
                    width="8"
                    height="20"
                    rx="2"
                    fill="#818cf8"
                />
                <rect
                    x="35"
                    y="106"
                    width="8"
                    height="14"
                    rx="2"
                    fill="#a5b4fc"
                />
                <rect
                    x="46"
                    y="111"
                    width="8"
                    height="9"
                    rx="2"
                    fill="#c7d2fe"
                />
                <path
                    d="M15 82 L28 88 L39 92 L52 96"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                />
                <circle cx="52" cy="96" r="3" fill="#f59e0b" />
                <rect
                    x="13"
                    y="46"
                    width="44"
                    height="28"
                    rx="6"
                    fill="#ffffff"
                />
                <rect
                    x="19"
                    y="53"
                    width="20"
                    height="4"
                    rx="2"
                    fill="#c7d2fe"
                />
                <rect
                    x="19"
                    y="62"
                    width="30"
                    height="6"
                    rx="3"
                    fill="#4f46e5"
                />
            </g>

            {/* Vade takvimi */}
            <g transform="rotate(-6 492 78) translate(452 30)">
                <rect
                    x="0"
                    y="6"
                    width="84"
                    height="88"
                    rx="10"
                    fill="#ffffff"
                />
                <path
                    d="M0 16 a10 10 0 0 1 10 -10 h64 a10 10 0 0 1 10 10 v12 h-84 Z"
                    fill="#6366f1"
                />
                <rect
                    x="18"
                    y="0"
                    width="7"
                    height="16"
                    rx="3.5"
                    fill="#312e81"
                />
                <rect
                    x="59"
                    y="0"
                    width="7"
                    height="16"
                    rx="3.5"
                    fill="#312e81"
                />
                <text
                    x="42"
                    y="66"
                    textAnchor="middle"
                    fontSize="32"
                    fontWeight="800"
                    fill="#312e81"
                >
                    {months}
                </text>
                <text
                    x="42"
                    y="84"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    letterSpacing="2"
                    fill="#6366f1"
                >
                    {monthLabel}
                </text>
            </g>

            {/* Parıltılar */}
            <g fill="#ffffff">
                <path
                    d="M170 70 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z"
                    opacity="0.9"
                />
                <path
                    d="M362 32 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 Z"
                    opacity="0.8"
                />
                <path
                    d="M540 128 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z"
                    opacity="0.7"
                />
                <path
                    d="M24 170 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z"
                    opacity="0.6"
                />
            </g>
        </svg>
    );
}
