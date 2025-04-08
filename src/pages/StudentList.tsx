import {FC, useMemo} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table.tsx";
import AttendanceStateGroup from "@/modules/attendances/infrastructure/ui/components/AttendanceStateGroup.tsx";
import useLiveStudents from "@/modules/students/infrastructure/directus/useLiveStudents.ts";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card.tsx";
import {FolderSync} from "lucide-react";
import {columns} from "@/pages/Columns.tsx";

const StudentList: FC = () => {
    const { data } = useLiveStudents();

    // Usamos useMemo para evitar recalcular 'rows' en cada render
    const rows = useMemo(() => data(), [data]);

    return (
        <Card className="grow">
            <CardHeader className="flex flex-row flex-wrap gap-x-[clamp(0.5rem,0.5rem+1vw,1rem)] items-center justify-between">
                <CardTitle className="w-fill text-xl">Lista de alumnos</CardTitle>
                <CardDescription className="text-[clamp(0.75rem,0.75rem+1vh,1rem)] flex flex-row flex-wrap gap-x-[clamp(0.25rem,0.25rem+1vw,0.5rem)] items-center max-sm:items-start text-wrap">
                    <FolderSync className="size-[clamp(0.75rem,0.75rem+1vh,1rem)]" />
                    Las asistencias se guardan automáticamente.
                </CardDescription>
            </CardHeader>

            <CardContent className="grow flex flex-col items-center justify-center w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Asistencia</TableHead>
                            {columns.map(({ key, label }) => (
                                <TableHead key={key}>{label}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell>
                                    <AttendanceStateGroup studentId={student.id} />
                                </TableCell>
                                <TableCell>{student.code}</TableCell>
                                <TableCell>{student.surname}</TableCell>
                                <TableCell>{student.givenName}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

            <CardFooter className="text-[clamp(0.75rem,0.75rem+1vh,1rem)] flex flex-row flex-wrap gap-x-[clamp(0.25rem,0.25rem+1vw,0.5rem)] items-center justify-center max-sm:items-start text-wrap">
                <FolderSync className="size-[clamp(0.75rem,0.75rem+1vh,1rem)]" />
                Las asistencias se guardan automáticamente.
            </CardFooter>
        </Card>
    );
};

export default StudentList;
