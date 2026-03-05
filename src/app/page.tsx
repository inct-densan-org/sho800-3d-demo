"use client"
import {useEffect, useRef} from "react";
import * as THREE from 'three'
import {Object3D} from 'three'
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";


export default function Home() {
    const mountRef = useRef<HTMLDivElement>(null);
    let rotateAngle = 0;

    useEffect(() => {
        const w = 1920;
        const h = 1080;

        const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})  // レンダラーをインスタンス化. こいつに色々追加していく. alphaを有効にすると透過できる.
        const elm = mountRef.current  // currentを別の変数に入れないとエラー出るらしい.

        elm?.appendChild(renderer.domElement);  // rendererのHTMLに入れる用DOMを描画先divの子にする
        renderer.setPixelRatio(window.devicePixelRatio);  // 1ピクセルの大きさを設定?
        renderer.setSize(w, h); // レンダラーのサイズを設定.


        const scene = new THREE.Scene();  // Unityみたいにシーンを作る

        const camera = new THREE.PerspectiveCamera(45, w / h, 1, 10000);  // fov(視野角). aspect(縦横比), near(近くの描画距離), far(遠くの描画距離)
        camera.position.set(0, 0, +2);  // カメラの位置を設定

        const controls = new OrbitControls(camera, renderer.domElement);  // カメラコントローラー)

        let loadedModel: THREE.Group | null = null;  // ロード済みモデルを捕まえる用変数
        const loader = new GLTFLoader()
        loader.load('/densan.glb', (gltf: GLTF) => {
            const model = gltf.scene; // 読み込んだgltfのモデル部分はsceneに入っている
            model.scale.set(1.75, 1.75, 1.75);

            // ワイヤフレームにする
            model.traverse((child: Object3D) => { // 読み込んだmodelは複数のオブジェクトで構成されている, traverseで全てにコールバックを実行する 
                if (child instanceof THREE.Mesh) {  // 読み込んだ子がMeshだったなら

                    // 元の面(ポリゴン)を非表示にする
                    if (Array.isArray(child.material)) { // materialが配列のことがあるので条件分岐
                        child.material.forEach(mat => mat.visible = false);
                    } else if (child.material) {
                        child.material.visible = false;
                    }

                    const edges = new THREE.EdgesGeometry(child.geometry, 4.15); // 一定の角度以上折れ曲がっている線のジオメトリだけを抽出するメソッド

                    const lineMaterial = new THREE.LineBasicMaterial({color: 0x4444aa});  // 着色用のマテリアルを作成

                    const lineSegments = new THREE.LineSegments(edges, lineMaterial); // ジオメトリとマテリアルを合わせて線オブジェクトを作成
                    child.add(lineSegments);
                }
            });

            scene.add(model)
            model.rotation.x = 3.14 / 180 * 20; // x軸にちょっと傾ける
            loadedModel = model;
        })

        const directionalLight = new THREE.DirectionalLight(0xffffff, 5.0); // 光源を用意
        directionalLight.position.set(-1, 1, 1); // 光源の場所を設定

        scene.add(directionalLight); // 光源をシーンに追加


        const tick = () => {  // 毎tickの処理コールバック
            if (loadedModel) {
                loadedModel.rotation.y -= 0.001; // y(垂直な縦)軸の回転をちょっとずつ増やす
                rotateAngle = loadedModel.rotation.y;
            }
            renderer.render(scene, camera); // 回転したメッシュを含んだ新しいシーンを描画する 

            requestAnimationFrame(tick);  // このコールバックの実行要請をして次のシーンにつなぐ
        }

        tick() // 最初の1コール

        return () => { // このコンポーネントが破棄されるとき:
            elm?.removeChild(renderer.domElement); // THREEのレンダラーによるCanvasを削除
        }
    }, [])

    useEffect(() => {
        // cssのrotate変数をbodyに設定し,　常時1ずつ加算
        let animationFrameId: number;

        const animate = () => {
            document.body.style.setProperty('--rotate', `${rotateAngle}rad`);
            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            document.body.style.removeProperty('--rotate');
        }
    }, [])


    return (
        <main className={"relative min-h-dvh overflow-hidden"}>
            {/*canvas格納用*/}
            <div ref={mountRef} className={"absolute top-1/2 left-1/2 -translate-1/2 "}/>

            {/*周囲の装飾*/}
            <img src={"/ring.png"}
                 className={"absolute top-1/2 left-1/2 -translate-1/2 aspect-square max-h-[110em] max-w-[110em] h-auto w-auto select-none pointer-events-none object-contain rotate-[var(--rotate)] opacity-70"}/>
            
            {/*見出し*/}
            <p className={"absolute text-center top-1/2 left-1/2 -translate-1/2 ml-8 w-full text-[20vw] tracking-[3vw] select-none pointer-events-none font-extrabold  text-white"}>電<span className={"text-[#ffffff]"}>算</span>部</p>
        </main>
    )
}
