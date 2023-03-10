PGDMP         "                 {         
   open_music    15.1    15.1 )    A           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            B           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            C           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            D           1262    16459 
   open_music    DATABASE     l   CREATE DATABASE open_music WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE open_music;
                faizal    false            ?            1259    16474    albums    TABLE     ?   CREATE TABLE public.albums (
    id character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    year integer NOT NULL,
    created_at text NOT NULL,
    updated_at text NOT NULL
);
    DROP TABLE public.albums;
       public         heap    faizal    false            ?            1259    16784    authentications    TABLE     8   CREATE TABLE public.authentications (
    token text
);
 #   DROP TABLE public.authentications;
       public         heap    faizal    false            ?            1259    16755    collaborations    TABLE     ?   CREATE TABLE public.collaborations (
    id character varying(255) NOT NULL,
    playlist_id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL
);
 "   DROP TABLE public.collaborations;
       public         heap    faizal    false            ?            1259    16461    pgmigrations    TABLE     ?   CREATE TABLE public.pgmigrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    run_on timestamp without time zone NOT NULL
);
     DROP TABLE public.pgmigrations;
       public         heap    faizal    false            ?            1259    16460    pgmigrations_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.pgmigrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.pgmigrations_id_seq;
       public          faizal    false    215            E           0    0    pgmigrations_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.pgmigrations_id_seq OWNED BY public.pgmigrations.id;
          public          faizal    false    214            ?            1259    16772    playlist_song_activities    TABLE     !  CREATE TABLE public.playlist_song_activities (
    id character varying(255) NOT NULL,
    playlist_id character varying(255) NOT NULL,
    song_id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    action character varying(255) NOT NULL,
    "time" text
);
 ,   DROP TABLE public.playlist_song_activities;
       public         heap    faizal    false            ?            1259    16733    playlist_songs    TABLE     ?   CREATE TABLE public.playlist_songs (
    id character varying(255) NOT NULL,
    playlist_id character varying(255) NOT NULL,
    song_id character varying(255) NOT NULL
);
 "   DROP TABLE public.playlist_songs;
       public         heap    faizal    false            ?            1259    16726 	   playlists    TABLE     ?   CREATE TABLE public.playlists (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    owner character varying(255) NOT NULL
);
    DROP TABLE public.playlists;
       public         heap    faizal    false            ?            1259    16467    songs    TABLE     \  CREATE TABLE public.songs (
    id character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    year integer NOT NULL,
    performer character varying(255) NOT NULL,
    genre character varying(255) NOT NULL,
    duration integer,
    "albumId" character varying(50),
    created_at text NOT NULL,
    updated_at text NOT NULL
);
    DROP TABLE public.songs;
       public         heap    faizal    false            ?            1259    16719    users    TABLE     ?   CREATE TABLE public.users (
    id character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    fullname character varying(255) NOT NULL
);
    DROP TABLE public.users;
       public         heap    faizal    false            ?           2604    16464    pgmigrations id    DEFAULT     r   ALTER TABLE ONLY public.pgmigrations ALTER COLUMN id SET DEFAULT nextval('public.pgmigrations_id_seq'::regclass);
 >   ALTER TABLE public.pgmigrations ALTER COLUMN id DROP DEFAULT;
       public          faizal    false    214    215    215            8          0    16474    albums 
   TABLE DATA           H   COPY public.albums (id, name, year, created_at, updated_at) FROM stdin;
    public          faizal    false    217   ?/       >          0    16784    authentications 
   TABLE DATA           0   COPY public.authentications (token) FROM stdin;
    public          faizal    false    223   ?/       <          0    16755    collaborations 
   TABLE DATA           B   COPY public.collaborations (id, playlist_id, user_id) FROM stdin;
    public          faizal    false    221   ?/       6          0    16461    pgmigrations 
   TABLE DATA           8   COPY public.pgmigrations (id, name, run_on) FROM stdin;
    public          faizal    false    215   0       =          0    16772    playlist_song_activities 
   TABLE DATA           e   COPY public.playlist_song_activities (id, playlist_id, song_id, user_id, action, "time") FROM stdin;
    public          faizal    false    222   q0       ;          0    16733    playlist_songs 
   TABLE DATA           B   COPY public.playlist_songs (id, playlist_id, song_id) FROM stdin;
    public          faizal    false    220   ?0       :          0    16726 	   playlists 
   TABLE DATA           4   COPY public.playlists (id, name, owner) FROM stdin;
    public          faizal    false    219   ?0       7          0    16467    songs 
   TABLE DATA           o   COPY public.songs (id, title, year, performer, genre, duration, "albumId", created_at, updated_at) FROM stdin;
    public          faizal    false    216   ?0       9          0    16719    users 
   TABLE DATA           A   COPY public.users (id, username, password, fullname) FROM stdin;
    public          faizal    false    218   ?0       F           0    0    pgmigrations_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.pgmigrations_id_seq', 2, true);
          public          faizal    false    214            ?           2606    16480    albums album_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY public.albums
    ADD CONSTRAINT album_pkey PRIMARY KEY (id);
 ;   ALTER TABLE ONLY public.albums DROP CONSTRAINT album_pkey;
       public            faizal    false    217            ?           2606    16761 "   collaborations collaborations_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.collaborations
    ADD CONSTRAINT collaborations_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.collaborations DROP CONSTRAINT collaborations_pkey;
       public            faizal    false    221            ?           2606    16466    pgmigrations pgmigrations_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.pgmigrations
    ADD CONSTRAINT pgmigrations_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.pgmigrations DROP CONSTRAINT pgmigrations_pkey;
       public            faizal    false    215            ?           2606    16778 6   playlist_song_activities playlist_song_activities_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.playlist_song_activities
    ADD CONSTRAINT playlist_song_activities_pkey PRIMARY KEY (id);
 `   ALTER TABLE ONLY public.playlist_song_activities DROP CONSTRAINT playlist_song_activities_pkey;
       public            faizal    false    222            ?           2606    16739 "   playlist_songs playlist_songs_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.playlist_songs
    ADD CONSTRAINT playlist_songs_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.playlist_songs DROP CONSTRAINT playlist_songs_pkey;
       public            faizal    false    220            ?           2606    16732    playlists playlists_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.playlists
    ADD CONSTRAINT playlists_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.playlists DROP CONSTRAINT playlists_pkey;
       public            faizal    false    219            ?           2606    16713    songs song_pkey 
   CONSTRAINT     M   ALTER TABLE ONLY public.songs
    ADD CONSTRAINT song_pkey PRIMARY KEY (id);
 9   ALTER TABLE ONLY public.songs DROP CONSTRAINT song_pkey;
       public            faizal    false    216            ?           2606    16725    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            faizal    false    218            ?           2606    16714    songs albumId    FK CONSTRAINT     q   ALTER TABLE ONLY public.songs
    ADD CONSTRAINT "albumId" FOREIGN KEY ("albumId") REFERENCES public.albums(id);
 9   ALTER TABLE ONLY public.songs DROP CONSTRAINT "albumId";
       public          faizal    false    3477    217    216            ?           2606    16750    playlists owner    FK CONSTRAINT     l   ALTER TABLE ONLY public.playlists
    ADD CONSTRAINT owner FOREIGN KEY (owner) REFERENCES public.users(id);
 9   ALTER TABLE ONLY public.playlists DROP CONSTRAINT owner;
       public          faizal    false    219    218    3479            ?           2606    16740    playlist_songs playlist_id    FK CONSTRAINT     ?   ALTER TABLE ONLY public.playlist_songs
    ADD CONSTRAINT playlist_id FOREIGN KEY (playlist_id) REFERENCES public.playlists(id);
 D   ALTER TABLE ONLY public.playlist_songs DROP CONSTRAINT playlist_id;
       public          faizal    false    219    3481    220            ?           2606    16762    collaborations playlist_id    FK CONSTRAINT     ?   ALTER TABLE ONLY public.collaborations
    ADD CONSTRAINT playlist_id FOREIGN KEY (playlist_id) REFERENCES public.playlists(id);
 D   ALTER TABLE ONLY public.collaborations DROP CONSTRAINT playlist_id;
       public          faizal    false    219    3481    221            ?           2606    16779 $   playlist_song_activities playlist_id    FK CONSTRAINT     ?   ALTER TABLE ONLY public.playlist_song_activities
    ADD CONSTRAINT playlist_id FOREIGN KEY (playlist_id) REFERENCES public.playlists(id);
 N   ALTER TABLE ONLY public.playlist_song_activities DROP CONSTRAINT playlist_id;
       public          faizal    false    219    222    3481            ?           2606    16745    playlist_songs song_id    FK CONSTRAINT     u   ALTER TABLE ONLY public.playlist_songs
    ADD CONSTRAINT song_id FOREIGN KEY (song_id) REFERENCES public.songs(id);
 @   ALTER TABLE ONLY public.playlist_songs DROP CONSTRAINT song_id;
       public          faizal    false    220    216    3475            ?           2606    16767    collaborations user_id    FK CONSTRAINT     u   ALTER TABLE ONLY public.collaborations
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id);
 @   ALTER TABLE ONLY public.collaborations DROP CONSTRAINT user_id;
       public          faizal    false    3479    218    221            8      x?????? ? ?      >      x?????? ? ?      <      x?????? ? ?      6   [   x?3?443762?4???E??%??%?I9????y??FFƺ???
FV?fV??z?f?f\F0?&??fff??s?Js??????? "?	      =      x?????? ? ?      ;      x?????? ? ?      :      x?????? ? ?      7      x?????? ? ?      9      x?????? ? ?     