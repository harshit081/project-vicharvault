import Feed from '@components/Feed';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/posts');
      const newPosts = await response.json();
      setPosts(newPosts);
    };

    fetchPosts();

    const intervalId = setInterval(fetchPosts, 5000); // fetch new posts every 5 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Discover & Share
        <br className="max-md:hidden"/>
        <span className="orange_gradient text-center"> AI-Powered Prompts</span>
      </h1>
      <p className="desc text-center">
        VicharVault is an open-source AI prompting tool for modern world to discover,create and share creative prompts
      </p>

      <Feed posts={posts} />
    </section>
  );
};

export default Home;