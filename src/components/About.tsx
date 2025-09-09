import Sidebar from "./Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Github, ExternalLink, Shield, Zap, Database, Cloud, Linkedin } from 'lucide-react'

function About() {
    const techStack = [
        { name: "React", category: "Frontend" },
        { name: "TypeScript", category: "Language" },
        { name: "Vite", category: "Build Tool" },
        { name: "Tailwind CSS", category: "Styling" },
        { name: "shadcn/ui", category: "UI Library" },
        { name: "Node.js", category: "Backend" },
        { name: "Express.js", category: "API Framework" },
        { name: "Supabase", category: "Database" },
        { name: "Plaid API", category: "Financial Data" },
        { name: "Railway", category: "Deployment" },
    ]

    const features = [
        {
            icon: <Shield className="w-5 h-5" />,
            title: "Enterprise Security",
            description: "Rate limiting, Helmet.js security headers, CORS protection, and JWT authentication"
        },
        {
            icon: <Database className="w-5 h-5" />,
            title: "Real Banking Integration",
            description: "Plaid API integration for secure connection to 11,000+ financial institutions"
        },
        {
            icon: <Zap className="w-5 h-5" />,
            title: "Production Ready",
            description: "Environment-aware configuration, comprehensive logging, and deployment automation"
        },
        {
            icon: <Cloud className="w-5 h-5" />,
            title: "Full-Stack Architecture",
            description: "Separate frontend and backend services with proper API design and database modeling"
        }
    ]

    return (
        <>
        <Sidebar />
        <div className="flex-1 p-8 ml-16 bg-white dark:bg-[#1F2124] min-h-screen">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                        Clarity Finance Tracker
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        A personal finance management application built with modern web technologies
                    </p>
                    <div className="flex justify-center gap-4">
                        <a 
                            href="https://github.com/DavidABest/finance-tracker" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            View on GitHub
                        </a>
                        <a 
                            href="https://linkedin.com/in/davidabest" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-[#0B66C2] !text-white rounded-lg hover:bg-[#004182] transition-colors"
                        >
                            <Linkedin className="w-4 h-4 text-white" />
                            Connect on LinkedIn
                        </a>
                    </div>
                </div>

                {/* Tech Stack */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Technology Stack
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {techStack.map((tech, index) => (
                                <Badge 
                                    key={index} 
                                    variant="secondary" 
                                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                >
                                    {tech.name}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Key Features */}
                <Card>
                    <CardHeader>
                        <CardTitle>Key Features & Architecture</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* About the Developer */}
                <Card>
                    <CardHeader>
                        <CardTitle>About the Developer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-300">
                            Built by <strong>David Best</strong>, this application demonstrates proficiency in modern web development, 
                            financial API integration, security best practices, and scalable production deployment.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Frontend Skills</h4>
                                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                                    <li>• React Hooks & Context API</li>
                                    <li>• TypeScript for type safety</li>
                                    <li>• Responsive design with Tailwind CSS</li>
                                    <li>• Component-based architecture</li>
                                    <li>• State management & routing</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Backend Skills</h4>
                                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                                    <li>• RESTful API design</li>
                                    <li>• Authentication & authorization</li>
                                    <li>• Rate limiting & security middleware</li>
                                    <li>• Third-party API integration</li>
                                    <li>• Environment configuration</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Future Roadmap */}
                <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                    <CardHeader>
                        <CardTitle className="text-green-800 dark:text-green-200">Future Enhancements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Technical Expansions</h4>
                                <ul className="text-green-700 dark:text-green-300 space-y-1">
                                    <li>• Machine learning for spending insights</li>
                                    <li>• Real-time WebSocket notifications</li>
                                    <li>• Progressive Web App (PWA) features</li>
                                    <li>• Microservices architecture scaling</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Business Features</h4>
                                <ul className="text-green-700 dark:text-green-300 space-y-1">
                                    <li>• Investment portfolio tracking</li>
                                    <li>• Budget optimization algorithms</li>
                                    <li>• Multi-currency support</li>
                                    <li>• Financial goal automation</li>
                                </ul>
                            </div>
                        </div>
                        <p className="text-green-700 dark:text-green-300 mt-4 text-sm">
                            <strong>Currently Seeking:</strong> Software engineering opportunities to apply and expand these skills 
                            in collaborative, growth-oriented environments focused on impactful financial technology solutions.
                        </p>
                    </CardContent>
                </Card>

                {/* Demo Data Notice */}
                <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
                    <CardContent className="pt-6">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>Demo Mode:</strong> This application includes realistic (spoofed) financial transactions for demonstration purposes. 
                            All data is fictitious and generated for showcasing the application's capabilities without requiring real banking connections.
                            The app supports real Plaid integration when configured with production credentials.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
        </>
    )
}

export default About