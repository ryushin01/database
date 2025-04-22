import { Grid, GridItem } from "@components/Layout";
import food from "@data/food.json";
import drink from "@data/drink.json";
import seasoning from "@data/seasoning.json";
import etc from "@data/etc.json";

const Detail = () => {
  return (
    <div className="flex w-full">
      <Grid>
        <GridItem mobile={12} tablet={6} desktop={6}>
          <div className="py-6">
            <h1 className="mb-12 text-3xl md:text-5xl text-center">프로그램</h1>
            <div className="grid md:grid-cols-2 gap-12 md:gap-24">
              <section className="flex flex-col gap-y-6">
                <div className="flex flex-col gap-y-3">
                  <h2 className="text-base md:text-lg"><span className="text-3xl md:text-5xl">A</span>ctivity</h2>
                  <p className="text-base md:text-lg">선선한 바람과 함께 낯선 스포츠를 경험하는 시간</p>
                </div>
                <div>
                  <ul className="flex flex-col gap-y-6">
                    <li className="flex items-center gap-x-3">
                      <img src="/presentation/images/program/flying-disc.png" alt="플라잉 디스크" className="w-12 h-12"/>
                      <span className="flex flex-col">
                        <span className="text-base md:text-lg">플라잉 디스크</span>
                        <span className="text-base md:text-lg text-[#3498db]">#프리즈비 #개랑같이안함</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </section>
              <section className="flex flex-col gap-y-6">
                <div className="flex flex-col gap-y-3">
                  <h2 className="text-base md:text-lg"><span className="text-3xl md:text-5xl">B</span>oard Game</h2>
                  <p className="text-base md:text-lg">웃다 보면 이미 새벽</p>
                </div>
                <div>
                  <ul className="flex flex-col gap-y-6">
                    <li className="flex items-center gap-x-3">
                      <span className="w-12 h-12 [&>img]:object-contain">
                         <img src="/presentation/images/program/boardgame1.jpg" alt="탑텐 TV"/>
                      </span>
                      <span className="flex flex-col">
                        <span className="text-base md:text-lg">탑텐 TV</span>
                        <span className="text-base md:text-lg text-[#3498db]">#협력 #센스 #남탓</span>
                      </span>
                    </li>
                    <li className="flex items-center gap-x-3">
                      <span className="w-12 h-12 [&>img]:object-contain">
                         <img src="/presentation/images/program/boardgame2.jpg" alt="한밤의 늑대인간"/>
                      </span>
                      <span className="flex flex-col">
                        <span className="text-base md:text-lg">한밤의 늑대인간</span>
                        <span className="text-base md:text-lg text-[#3498db]">#마피아 #사기 #연기</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </section>
              <section className="flex flex-col gap-y-6">
                <div className="flex flex-col gap-y-3">
                  <h2 className="text-base md:text-lg"><span className="text-3xl md:text-5xl">C</span>ollection</h2>
                  <p className="text-base md:text-lg">추억 쌓기 프로그램</p>
                </div>
                <div>
                  <ul className="flex flex-col gap-y-6">
                    <li className="flex items-center gap-x-3">
                      <img src="/presentation/images/program/camera.png" alt="카메라" className="w-12 h-12"/>
                      <span className="flex flex-col">
                        <span className="text-base md:text-lg">폴라로이드 카메라</span>
                        <span className="text-base md:text-lg text-[#3498db]">#앨범제작 #수시촬영예정</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </section>
              <section className="flex flex-col gap-y-6">
                <div className="flex flex-col gap-y-3">
                  <h2 className="text-base md:text-lg"><span className="text-3xl md:text-5xl">D</span>iscussion</h2>
                  <p className="text-base md:text-lg">숨 막히는 담소(?)의 장</p>
                </div>
                <div>
                  <ul className="flex flex-col gap-y-6">
                    <li className="flex items-center gap-x-3">
                      <img src="/presentation/images/program/talk.png" alt="토론" className="w-12 h-12"/>
                      <span className="flex flex-col">
                        <span className="text-base md:text-lg">토론</span>
                        <span className="text-base md:text-lg text-[#3498db]">#왜류진선은모바일청첩장을먼저보냈는가 #괴롭히는거아님</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </section>
              <section className="flex flex-col gap-y-6">
                <div className="flex flex-col gap-y-3">
                  <h2 className="text-base md:text-lg"><span className="text-3xl md:text-5xl">E</span>ating</h2>
                  <p className="text-base md:text-lg">사실 먹기 위해 여기까지 왔습니다</p>
                </div>
                <div>
                  <ul className="flex flex-col gap-y-6">
                    <li className="flex items-center gap-x-3">
                      <img src="/presentation/images/program/food.png" alt="스테이크" className="w-12 h-12"/>
                      <span className="flex flex-col">
                        <span className="text-base md:text-lg">푸드 파이터</span>
                        <span className="text-base md:text-lg text-[#3498db]">#쉬지않고계속먹을거임</span>
                      </span>
                    </li>
                    <li className="flex items-center gap-x-3">
                      <img src="/presentation/images/program/drink.png" alt="위스키" className="w-12 h-12"/>
                      <span className="flex flex-col">
                        <span className="text-base md:text-lg">알코올</span>
                        <span className="text-base md:text-lg text-[#3498db]">#함께하는첫음주</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </section>
              <section className="flex flex-col gap-y-6">
                <div className="flex flex-col gap-y-3">
                  <h2 className="text-base md:text-lg"><span className="text-3xl md:text-5xl">F</span>ire</h2>
                  <p className="text-base md:text-lg">이번 여행의 하이라이트</p>
                </div>
                <div>
                  <ul className="flex flex-col gap-y-6">
                    <li className="flex items-center gap-x-3">
                      <img src="/presentation/images/program/fire.png" alt="불멍" className="w-12 h-12"/>
                      <span className="flex flex-col">
                        <span className="text-base md:text-lg">불멍</span>
                        <span className="text-base md:text-lg text-[#3498db]">#울지말자</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </GridItem>
        <GridItem mobile={12} tablet={6} desktop={6}>
          <div className="py-12 md:py-6">
            <h1 className="mb-12 text-3xl md:text-5xl text-center">준비물</h1>
            <div className="flex flex-col gap-y-12">
              <section className="flex flex-col gap-y-3">
                <div className="flex items-center gap-x-2">
                  <img src="/presentation/images/supplies/food.png" alt="음식" className="w-12 h-12"/>
                  <h2 className="text-3xl md:text-5xl">음식</h2>
                </div>
                <ul className="grid grid-cols-2 gap-2">
                  {food.data.map((supply) => {
                    return (
                        <li key={supply}>
                          <label
                              htmlFor={supply}
                              className="flex items-center"
                          >
                            <input type="checkbox" id={supply} name={supply} className="min-w-6 min-h-6"/>
                            <span className="ml-2 text-base md:text-lg">{supply}</span>
                          </label>
                        </li>
                    )
                  })}
                </ul>
              </section>
              <section className="flex flex-col gap-y-3">
                <div className="flex items-center gap-x-2">
                  <img src="/presentation/images/supplies/drink.png" alt="음료" className="w-12 h-12"/>
                  <h2 className="text-3xl md:text-5xl">음료</h2>
                </div>
                <ul className="grid grid-cols-2 gap-2">
                  {drink.data.map((supply) => {
                    return (
                        <li key={supply}>
                          <label
                              htmlFor={supply}
                              className="flex items-center"
                          >
                            <input type="checkbox" id={supply} name={supply} className="min-w-6 min-h-6"/>
                            <span className="ml-2 text-base md:text-lg">{supply}</span>
                          </label>
                        </li>
                    )
                  })}
                </ul>
              </section>
              <section className="flex flex-col gap-y-3">
                <div className="flex items-center gap-x-2">
                  <img src="/presentation/images/supplies/seasoning.png" alt="양념 및 조미료" className="w-12 h-12"/>
                  <h2 className="text-3xl md:text-5xl">양념 및 조미료</h2>
                </div>
                <ul className="grid grid-cols-2 gap-2">
                  {seasoning.data.map((supply) => {
                    return (
                        <li key={supply}>
                          <label
                              htmlFor={supply}
                              className="flex items-center"
                          >
                            <input type="checkbox" id={supply} name={supply} className="min-w-6 min-h-6"/>
                            <span className="ml-2 text-base md:text-lg">{supply}</span>
                          </label>
                        </li>
                    )
                  })}
                </ul>
              </section>
              <section className="flex flex-col gap-y-3">
                <div className="flex items-center gap-x-2">
                  <img src="/presentation/images/supplies/medicine.png" alt="의약품" className="w-12 h-12"/>
                  <h2 className="text-3xl md:text-5xl">기타</h2>
                </div>
                <ul className="grid grid-cols-2 gap-2">
                  {etc.data.map((supply) => {
                    return (
                        <li key={supply}>
                          <label
                              htmlFor={supply}
                              className="flex items-center"
                          >
                            <input type="checkbox" id={supply} name={supply} className="min-w-6 min-h-6"/>
                            <span className="ml-2 text-base md:text-lg">{supply}</span>
                          </label>
                        </li>
                    )
                  })}
                </ul>
              </section>
            </div>
          </div>
        </GridItem>
      </Grid>
    </div>
  );
};

export default Detail;
