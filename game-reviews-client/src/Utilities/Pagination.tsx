import { useEffect, useState } from "react";

export default function Pagination(props: paginationProps) {
    const [linkModels, setLinkModels] = useState<linkModel[]>([]);

    function selectPage(link: linkModel) {
        if (link.page === props.currentPage) { return; }
        if (!link.enabled) { return; }
        props.onPageChange(link.page);
    }

    function getClass(link: linkModel) {
        if (link.active) {
            return "active pointer"
        }
        if (!link.enabled) {
            return "disabled"
        }
        return "pointer"
    }

    useEffect(() => {
        //for previous pages:
        const previousPageEnabled = props.currentPage !== 1;
        const previousPage = props.currentPage - 1;
        const links: linkModel[] = [];
        links.push({
            text: "Previous",
            enabled: previousPageEnabled,
            page: previousPage,
            active: false
        })
        //for pages in between:
        for (let i = 1; i <= props.totalPages; i++) {
            if (i > props.currentPage - props.displayedPages && i < props.currentPage + props.displayedPages) {
                links.push({
                    text: `${i}`,
                    enabled: true,
                    page: i,
                    active: i === props.currentPage
                })
            }
        }
        //for next page:
        const nextPageEnabled = props.currentPage !== props.totalPages && props.totalPages > 0;
        const nextPage = props.currentPage + 1;
        links.push({
            text: "Next",
            enabled: nextPageEnabled,
            page: nextPage,
            active: false
        })
        setLinkModels(links);

    }, [props.currentPage, props.totalPages, props.displayedPages])


    return <nav>
        <ul className="pagination justify-content-center"  >
            {linkModels.map(link => <li key={link.text}
                onClick={() => selectPage(link)}
                className={`page-item cursor ${getClass(link)}`}
            >
                <span className="page-link">{link.text}</span>
            </li>)}


        </ul>
    </nav>
}

interface linkModel {
    page: number;
    enabled: boolean;
    text: string;
    active: boolean;
}

interface paginationProps {
    currentPage: number;
    totalPages: number;
    displayedPages: number;
    onPageChange(newPage: number): void;
}
Pagination.defaultProps = {
    displayedPages: 3
}