import Post from "components/Post";
import { IBlog } from "types/contentful-types";
import ContentService from "utils/contentful-service";

interface Params {
  params: {
    id: string;
  };
}

interface Props {
  post: IBlog;
}

export async function getStaticPaths() {
  const posts = await ContentService.instance.getEntriesByType("blog");
  const paths = posts.map((post) => ({
    params: { id: post.sys.id },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }: Params) {
  const { id } = params;

  try {
    const post = await ContentService.instance.getEntryById(id);
    return {
      props: {
        post,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}

export default function PostPage({ post }: Props) {
  return (
    <Post
      post={{
        ...post.fields,
        id: post.sys.id,
        createdAt: post.sys.createdAt,
      }}
    />
  );
}