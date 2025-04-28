import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const ErrorCard = ({ title, errors, isLoading, fetchError, consoleLink }) => {
  return (
    <Card className="min-w-150 shadow-xl gap-0">
      <CardHeader>
        <CardTitle>
          <a
            href={consoleLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {title}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="m-0 p-0">
        {fetchError && (
          <div className="text-red-500 text-sm p-2">{fetchError}</div>
        )}
        {isLoading ? (
          <div className="text-center p-4">Loading...</div>
        ) : (
          <span className="flex flex-col gap-2 text-xl">
            <Separator
              orientation="horizontal"
              className="bg-gray-500 w-full"
            />
            {errors.length === 0 ? (
              <div className="p-2">No errors found</div>
            ) : (
              <ScrollArea className="h-50 rounded-md">
                {errors.map((error, index) => (
                  <div key={index} className="p-2">
                    {error}
                  </div>
                ))}
              </ScrollArea>
            )}
          </span>
        )}
      </CardContent>
    </Card>
  );
};
export default ErrorCard;
