import { Button } from '@monorepo-ex-1/base-ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@monorepo-ex-1/base-ui';
import { CheckCircle } from 'lucide-react';

export default function DemoPage() {
  return (
    <div className="container mx-auto p-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-slate-800">Component Demo</h1>
        <p className="text-lg text-slate-600">
          Showcasing components from the <code>base-ui</code> library.
        </p>
      </header>

      {/* Button Demos */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-slate-700 mb-6">Buttons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          <div className="space-y-4 p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-medium text-slate-700">Variants</h3>
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>

          <div className="space-y-4 p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-medium text-slate-700">Sizes</h3>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>

          <div className="space-y-4 p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-medium text-slate-700">With Icon</h3>
            <Button>
              <CheckCircle className="mr-2 h-4 w-4" /> Login
            </Button>
            <Button variant="outline" size="icon">
              <CheckCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Card Demos */}
      <section>
        <h2 className="text-3xl font-semibold text-slate-700 mb-6">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <Card>
            <CardHeader>
              <CardTitle>Basic Card</CardTitle>
              <CardDescription>This is a basic card example.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                The card component can be used to display content in a structured manner.
                It includes several parts like header, title, description, content, and footer.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Learn More</Button>
            </CardFooter>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <CardTitle className="text-2xl">Card with Action</CardTitle>
                  <CardDescription>Featuring a prominent call to action.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Use cards to group related information and actions. This one has a more styled header
                and a primary action button in the footer.
              </p>
              <img
                src="https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Mountain landscape"
                className="rounded-md"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost">Dismiss</Button>
              <Button>Deploy Now</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
