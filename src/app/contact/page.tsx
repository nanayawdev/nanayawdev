import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Devs & Creatives",
  description: "Get in touch with Devs & Creatives. Contact us to discuss your project and learn how we can help your African startup or brand go global.",
};

export default function Contact() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to take your brand global? Let&apos;s discuss your project and explore how we can help you achieve your goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Get In Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground">📧</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="text-muted-foreground">hello@devsandcreatives.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground">📱</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Phone</h3>
                  <p className="text-muted-foreground">+234 XXX XXX XXXX</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground">📍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Location</h3>
                  <p className="text-muted-foreground">Lagos, Nigeria</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="https://twitter.com/devsandcreatives" className="text-muted-foreground hover:text-foreground transition-colors">
                  Twitter
                </a>
                <a href="https://linkedin.com/company/devsandcreatives" className="text-muted-foreground hover:text-foreground transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-lg border">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your last name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Company</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Project Type</label>
                <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Web Development</option>
                  <option>UI/UX Design</option>
                  <option>Mobile App</option>
                  <option>Brand Identity</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
