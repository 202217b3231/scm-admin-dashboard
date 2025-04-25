import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          <ScrollArea className="h-50 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errors.map((error, index) => (
                  <TableRow key={index}>
                    <TableCell>{error}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ErrorCard;
