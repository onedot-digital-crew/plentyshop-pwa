export type Breadcrumb = {
  name: string;
  link: string;
};

export type BreadcrumbsProps = {
  breadcrumbs: Breadcrumb[];
  whitecolor?: boolean; // Custom theme prop for white styling
};