import { useRouter } from "next/router"

const ListUserChat = () => {
    const Data= [
        {
            id: 1,
            avatar: "https://ss-images.saostar.vn/wp700/2019/08/01/5744647/67943796_2411808385576541_7075669379882418176_n.jpg",
            name: "Tham Son",
            firstName: "Tham",
            lastName: "Son",
            messenger: [
                {
                    content: "helloo",
                    createAt: "9/8/2022"
                }
            ]
        },
        {
            id: 2,
            avatar: "https://ss-images.saostar.vn/wp700/2019/08/01/5744647/67943796_2411808385576541_7075669379882418176_n.jpg",
            name: "Tham Son",
            firstName: "Tham",
            lastName: "Son",
            messenger: [
                {
                    content: "helloo",
                    createAt: "9/8/2022"
                }
            ]
        },
        {
            id:3,
            avatar: "https://ss-images.saostar.vn/wp700/2019/08/01/5744647/67943796_2411808385576541_7075669379882418176_n.jpg",
            name: "Tham Son",
            firstName: "Tham",
            lastName: "Son",
            messenger: [
                {
                    content: "helloo",
                    createAt: "9/8/2022"
                }
            ]
        },
        {
            avatar: "https://haycafe.vn/wp-content/uploads/2022/02/Anh-gai-xinh-Viet-Nam.jpg",
            name: "Thanh mai",
            firstName: "Tham",
            lastName: "Son",
            messenger: [
                {
                    content: "helloo",
                    createAt: "9/8/2022"
                }
            ]
        },
        {
            avatar: "https://ss-images.saostar.vn/wp700/2019/08/01/5744647/67943796_2411808385576541_7075669379882418176_n.jpg",
            name: "Tham Son",
            firstName: "Tham",
            lastName: "Son",
            messenger: [
                {
                    content: "helloo",
                    createAt: "9/8/2022"
                }
            ]
        },
        {
            avatar: "https://haycafe.vn/wp-content/uploads/2022/02/Anh-gai-xinh-Viet-Nam.jpg",
            name: "Tham Son",
            firstName: "Tham",
            lastName: "Son",
            messenger: [
                {
                    content: "helloo",
                    createAt: "9/8/2022"
                }
            ]
        },
        {
            avatar: "https://ss-images.saostar.vn/wp700/2019/08/01/5744647/67943796_2411808385576541_7075669379882418176_n.jpg",
            name: "Tham Son",
            firstName: "Tham",
            lastName: "Son",
            messenger: [
                {
                    content: "helloo",
                    createAt: "9/8/2022"
                }
            ]
        },
        {
            avatar: "https://ss-images.saostar.vn/wp700/2019/08/01/5744647/67943796_2411808385576541_7075669379882418176_n.jpg",
            name: "Tham Son",
            firstName: "Tham",
            lastName: "Son",
            messenger: [
                {
                    content: "helloo",
                    createAt: "9/8/2022"
                }
            ]
        },
        {
            avatar: "https://toquoc.mediacdn.vn/280518851207290880/2022/7/21/photo-2-16583718171161301381589-1658380092110-1658380092275771209786.jpg",
            name: "Lias",
            firstName: "Lia",
            lastName: "Lia",
            messenger: [
                {
                    content: "xin chao nhe ndnkfij f fngknf gnjkn dnkjnkjnfjrofijroijoi",
                    createAt: "9/8/2022"
                }
            ]
        },
        {
            avatar: "https://toquoc.mediacdn.vn/280518851207290880/2022/7/21/photo-2-16583718171161301381589-1658380092110-1658380092275771209786.jpg",
            name: "Lias",
            firstName: "Lia",
            lastName: "Lia",
            messenger: [
                {
                    content: "xin chao nhe ndnkfij f fngknf gnjkn dnkjnkjnfjrofijroijoi",
                    createAt: "9/8/2022"
                }
            ]
        },
        {
            avatar: "https://toquoc.mediacdn.vn/280518851207290880/2022/7/21/photo-2-16583718171161301381589-1658380092110-1658380092275771209786.jpg",
            name: "Lias",
            firstName: "Lia",
            lastName: "Lia",
            messenger: [
                {
                    content: "xin chao nhe ndnkfij f fngknf gnjkn dnkjnkjnfjrofijroijoi",
                    createAt: "9/8/2022"
                }
            ]
        },
    ]
    return (
        <div className="mt-2 flex-1 h-[850px] v-scrollbar">
            {
                Data.map((user) => (
                    <UserChatItem user={user}/>
                ))
            }
        </div>
    )
}

const UserChatItem = ({user,...props}) => {
    const router = useRouter();
    return (
        <div 
            onClick={() => router.push(`/messenger/${user.id}`)}
            className="flex hover:bg-sky-100 rounded-lg py-3 px-2 hover:cursor-pointer">
            <div className="text-center justify-center">
                <img src={user.avatar} alt="avatar" className="h-[65px] w-[65px] rounded-full"/>
            </div>
            <div className="flex-1 ml-3 mt-1">
                <p className="text-lg font-bold text-left">{user.name}</p>
                <p className="line-clamp-1 mt-1">{user.messenger[0].content}</p>
            </div>
            <div className="mx-2 my-auto">
                <p className="text-sm">{user.messenger[0].createAt}</p>
            </div>
        </div>
    )
}

export default ListUserChat;