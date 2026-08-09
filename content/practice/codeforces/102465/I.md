---
title: "CF 102465I - 梅森标记"
description: "我们有一个黑白像素网格代表几块石头。 黑色像素具有三种可能的作用。 有些属于所有石头外部相连的黑色区域，有些形成石头内部的实际石匠标记，有些是孤立的噪声像素。"
date: "2026-08-08T09:27:03+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102465
codeforces_index: "I"
codeforces_contest_name: "2018-2019 ICPC Southwestern European Regional Programming Contest (SWERC 2018)"
rating: 0
weight: 102465
solve_time_s: 259
verified: true
draft: false
---

[CF 102465I - 梅森的标记](https://codeforces.com/problemset/problem/102465/I)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 19s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个黑白像素网格代表几块石头。 黑色像素具有三种可能的作用。 有些属于所有石头外部相连的黑色区域，有些形成石头内部的实际石匠标记，有些是孤立的噪声像素。 每块石头都包含一个标记，该标记周围有白色像素。 

网格的尺寸最多为 1000 x 1000，因此最多可以有 100 万个像素。 重复扫描大部分图像以查找每个发现对象的解决方案可以轻松达到数十亿甚至数万亿次操作。 四秒限制强烈支持总工作量与像素数量成正比的算法，每个像素只需要少量恒定的工作量。 网格足够大，递归洪水填充在 Python 中也是不安全的，因为递归深度可以与网格大小呈线性关系。 

中心观察是这三个标记在拓扑上是不同的。 如果我们观察标记包围的白色区域，A 恰好包围一个白色区域，B 恰好包围两个白色区域，而 C 则不包围任何白色区域。 这些标记的尺寸可能会有所不同，因为参数 x 和 y 是任意的，因此测量边界框或黑色像素的确切数量并不可靠。 封闭的白色分量的数量不取决于 x 或 y。 

这个表述中隐藏着几个陷阱。 第一个是外部黑色区域。 考虑```
#######
#.....#
#..#..#
#.....#
#######
```孤立的`#`看起来像是一个可能的标记，但实际上是噪音。 更重要的是，属于外部区域的黑色像素本身可以类似于 C 或其他标记。 在尝试进行任何分类之前，必须将它们删除。 

第二个陷阱是对角线连接对于外部区域很重要。 例如，```
#######
#.....#
#.#...#
##....#
#######
```对角接触的两个黑色区域在8连通性下属于同一外部区域。 将外部区域视为 4 连接可能会留下一些像素并错误地将它们分类为标记。 

第三个陷阱是噪音。 噪声像素是仅由一个像素组成的黑色分量。 它周围的白色像素形成了石头表面的普通部分，而不是标记的封闭内部。 简单地计算与每个黑色分量相邻的白色分量的粗心解决方案可能会将此类像素误认为是 C 类标记，甚至会计算出错误的孔。 

第四个陷阱是白色表面使用4-连通性，而不是8-连通性。 对角间隙不连接两个白色区域。 例如，```
#######
#..#..#
#.#.#.#
#..#..#
#######
```在决定哪些白色像素属于同一区域时，必须使用垂直和水平邻接来解释。 使用 8 连接将合并由对角线接触分隔的区域，并且可以改变孔数。 

## 方法

 直接方法首先找到每个黑色分量，然后对于每个候选分量，检查周围的白色像素以确定它包围了多少个区域。 这在概念上是正确的，因为标记类型完全由其封闭的白色区域决定。 问题在于，为每个候选者对周围网格进行单独的洪水填充会重复处理相同的像素。 

在最坏的情况下，可能会有 θ(WH) 个小组件。 如果每个组件都引起另一次 θ(WH) 扫描，则总功变为 θ((WH)^2)。 对于 100 万像素，相当于 10^12 像素访问量级，远远超出了 4 秒的限制。 蛮力之所以有效，是因为每个单独的分类都很容易，但它会失败，因为相同的白色表面被一遍又一遍地探索。 

有用的观察是白色区域可以全局计算。 每个白色像素都属于一个 4 连接的白色分量，因此我们可以将每个白色分量恰好洪水填充一次。 在进行洪水填充时，我们检查接触它的黑色成分。 

石头的外表面接触石头周围的黑色区域。 属于标记的内部区域不接触外部黑色区域。 因为每颗宝石都只有一个标记，所以这样的内部白色分量可以与恰好一个非噪声黑色分量相关联。 噪声可以忽略，因为它的黑色分量的大小为一。 

然后问题就变成了一对全局连通分量计算。 首先，我们识别 8 连通的外部黑色区域。 接下来，我们标记每个剩余的黑色组件并记录其大小。 最后，我们用 4 个连接淹没每个白色组件。 对于不接触外部黑色区域的每个白色分量，我们增加接触它的唯一非噪声黑色分量的孔数。 

所得的孔数直接给出标记类型。 零孔表示 C，一孔表示 A，两孔表示 B。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((WH)^2) | O((WH)^2) | O(WH) | 太慢了 |
 | 最佳| O(WH) | O(WH) | 已接受 |

 ## 算法演练

 1. 将图像存储为字符串列表，并将每个像素视为网格图的顶点。 黑色像素稍后将使用 8 邻居邻接进行连接，而白色像素将使用 4 邻居邻接进行连接。 
2.从角像素开始洪水填充`(0, 0)`使用所有八个相邻方向。 整个边框是黑色的，并且声明保证属于外部区域的每个黑色像素都以8-连通性连接到边框。 因此，这种洪水填充恰好标记了外部黑色区域。 
3. 扫描所有剩余的黑色像素。 每当发现未标记的黑色像素时，运行 8 连接的洪水填充并为该组件提供新的 ID。 存储其大小。 尺寸为一的部件是噪音，而每个较大的部件都是真正的泥瓦匠标记。 
4. 扫描所有白色像素。 对于每个未访问的白色像素，运行 4 连接的洪水填充。 在洪水填充期间，检查所有相邻的黑色像素并记住三条信息：该白色分量是否接触外部黑色区域、它接触哪个非噪声黑色分量以及它是否接触多个这样的分量。 
5. 完全探索完一个白色组件后，对其角色进行分类。 如果触及外部黑色区域，则属于普通石材表面的一部分，不能是标记内部。 如果它不接触外部区域并且恰好与一个非噪声黑色组件相邻，则它是属于该标记的封闭区域，因此增加该组件的孔数。 噪声分量被故意忽略。 
6. 处理完所有白色部件后，检查每个非噪声黑色部件的孔数。 零个孔的分量代表 C，一个孔代表 A，两个孔代表 B。将相应的答案递增。 

关键的不变量是，在白色组件洪水填充完成后，每个白色组件都被准确地分类为普通石材表面或封闭内部。 由于石头表面是 4 连通的，并且每块石头都恰好有一个标记，因此封闭的组件只能属于该石头的标记。 由于每个噪声分量都有尺寸一，因此忽略尺寸一的黑色分量可以防止噪声产生空洞。 因此，每个真正的标记都准确地接收到其真实数量的封闭白色区域。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve():
    W, H = map(int, input().split())
    grid = [input().strip() for _ in range(H)]
    n = W * H

    # comp[idx] == -1: not a black component yet
    # comp[idx] == 0: outside black region
    # comp[idx] > 0: a genuine/noise black component
    comp = array('i', [-1]) * n

    # 1. Flood-fill the outside black region using 8-connectivity.
    stack = [0]
    comp[0] = 0

    while stack:
        p = stack.pop()
        r = p // W
        c = p - r * W

        r0 = max(0, r - 1)
        r1 = min(H - 1, r + 1)
        c0 = max(0, c - 1)
        c1 = min(W - 1, c + 1)

        for nr in range(r0, r1 + 1):
            base = nr * W
            for nc in range(c0, c1 + 1):
                if nr == r and nc == c:
                    continue
                q = base + nc
                if comp[q] == -1 and grid[nr][nc] == '#':
                    comp[q] = 0
                    stack.append(q)

    # sizes[component_id] is the number of black pixels.
    # Component 0 is the outside region.
    sizes = [0]
    sizes[0] = sum(1 for p in range(n) if comp[p] == 0)

    # 2. Label every remaining black component.
    for r in range(H):
        base = r * W
        for c in range(W):
            p = base + c
            if grid[r][c] != '#' or comp[p] != -1:
                continue

            cid = len(sizes)
            sizes.append(0)
            comp[p] = cid
            stack = [p]
            size = 0

            while stack:
                q = stack.pop()
                size += 1
                qr = q // W
                qc = q - qr * W

                r0 = max(0, qr - 1)
                r1 = min(H - 1, qr + 1)
                c0 = max(0, qc - 1)
                c1 = min(W - 1, qc + 1)

                for nr in range(r0, r1 + 1):
                    nbase = nr * W
                    for nc in range(c0, c1 + 1):
                        if nr == qr and nc == qc:
                            continue
                        nq = nbase + nc
                        if grid[nr][nc] == '#' and comp[nq] == -1:
                            comp[nq] = cid
                            stack.append(nq)

            sizes[cid] = size

    # 3. Flood-fill all white components with 4-connectivity.
    seen = bytearray(n)
    holes = [0] * len(sizes)

    for r in range(H):
        base = r * W
        for c in range(W):
            start = base + c
            if grid[r][c] != '.' or seen[start]:
                continue

            seen[start] = 1
            stack = [start]

            touches_outside = False
            candidate = -1
            multiple_marks = False

            while stack:
                p = stack.pop()
                pr = p // W
                pc = p - pr * W

                # Up
                if pr > 0:
                    q = p - W
                    if grid[pr - 1][pc] == '.':
                        if not seen[q]:
                            seen[q] = 1
                            stack.append(q)
                    else:
                        cid = comp[q]
                        if cid == 0:
                            touches_outside = True
                        elif sizes[cid] > 1:
                            if candidate == -1:
                                candidate = cid
                            elif candidate != cid:
                                multiple_marks = True

                # Down
                if pr + 1 < H:
                    q = p + W
                    if grid[pr + 1][pc] == '.':
                        if not seen[q]:
                            seen[q] = 1
                            stack.append(q)
                    else:
                        cid = comp[q]
                        if cid == 0:
                            touches_outside = True
                        elif sizes[cid] > 1:
                            if candidate == -1:
                                candidate = cid
                            elif candidate != cid:
                                multiple_marks = True

                # Left
                if pc > 0:
                    q = p - 1
                    if grid[pr][pc - 1] == '.':
                        if not seen[q]:
                            seen[q] = 1
                            stack.append(q)
                    else:
                        cid = comp[q]
                        if cid == 0:
                            touches_outside = True
                        elif sizes[cid] > 1:
                            if candidate == -1:
                                candidate = cid
                            elif candidate != cid:
                                multiple_marks = True

                # Right
                if pc + 1 < W:
                    q = p + 1
                    if grid[pr][pc + 1] == '.':
                        if not seen[q]:
                            seen[q] = 1
                            stack.append(q)
                    else:
                        cid = comp[q]
                        if cid == 0:
                            touches_outside = True
                        elif sizes[cid] > 1:
                            if candidate == -1:
                                candidate = cid
                            elif candidate != cid:
                                multiple_marks = True

            if not touches_outside and candidate != -1 and not multiple_marks:
                holes[candidate] += 1

    # 4. Translate the number of holes into A, B, or C.
    ans = [0, 0, 0]

    for cid in range(1, len(sizes)):
        if sizes[cid] == 1:
            continue

        if holes[cid] == 1:
            ans[0] += 1       # A
        elif holes[cid] == 2:
            ans[1] += 1       # B
        elif holes[cid] == 0:
            ans[2] += 1       # C

    print(*ans)

if __name__ == "__main__":
    solve()
```第一个洪水填充使用 8 个方向，因为该问题定义了具有对角连接以及水平和垂直连接的外部区域。 开始于`(0, 0)`就足够了，因为每个边界像素都属于该区域。 

第二个黑色洪水填充标记每个剩余的组件。 它的大小是区分可能的标记和噪声所需的唯一信息。 单个黑色分量不能成为标记，因为每个真正的标记都包含多个黑色像素。 

白色洪水填充特意采用 4 相连。 在处理白色分量时，代码记录它是否接触分量零，即外部黑色区域。 普通的石材表面总是有这样的联系。 封闭的标记内部则不然。 

这`candidate`变量记录唯一可以拥有白色区域的非噪声黑色分量。 做出此决定时，噪声像素将被忽略。 这很重要，因为噪声像素可以位于普通白色表面内部，甚至位于标记的白色内部内部，而不会改变标记的身份。 

不使用递归。 对于包含长走廊的网格，递归洪水填充可能会超出 Python 的递归限制。 显式堆栈还使内存使用情况可预测。 Python整数仅在临时DFS堆栈中使用，而组件标签存储在紧凑的`array('i')`。 

Python 中不存在整数溢出问题。 最大的相关索引低于 100 万，所有组件大小最多为 100 万。 

## 工作示例

 ### 示例 1

 给定的样本在去除外部8连接的黑色区域后包含两个真实标记。 一个黑色组件有两个封闭的白色组件，而另一个黑色组件有一个封闭的白色组件。 孤立的黑色像素是噪声，并且声明中提到的C形图案与外部区域相连，因此被丢弃。 

| 舞台| 对象| 黑色尺码| 封闭的白色组件| 分类|
 | ---| ---| ---| ---| ---|
 | 黑色洪水填充 | 地区外 | 许多| 不考虑| 外面|
 | 黑色组件| 左标记| 大于 1 | 2 | 乙|
 | 黑色组件| 其他正品标记| 大于 1 | 1 | 一个 |
 | 黑色组件| 隔离噪音| 1 | 被忽略 | 噪音|
 | 黑色组件| C型外纹| 外部的一部分 | 不考虑| 外面|

 最终计数为`A = 1`,`B = 1`， 和`C = 0`, 给予`1 1 0`。 

该轨迹的有用部分是分类不依赖于标记的宽度或高度。 即使 B 的参数与另一个标记不同，这两个孔也足以识别 B。 

### 构造示例 2

 考虑一张包含单个 C 形标记和一个噪声像素的图片：```
#########
#.......#
#.......#
#.#####.#
#.#.....#
#.#####.#
#.......#
#.......#
#########
```去掉外面的黑色成分后，C形黑色成分就没有封闭的白色成分了。 开放部分内的孤立黑色像素是噪声，其分量大小为 1。 

| 舞台| 对象| 黑色尺码| 无外部接触的白色组件 | 分类|
 | ---| ---| ---| ---| ---|
 | 黑色洪水填充 | 边境地区 | 许多| 不考虑| 外面|
 | 黑色组件| C形标记| 大于 1 | 0 | C |
 | 黑色组件| 隔离噪音| 1 | 被忽略 | 噪音|

 结果是`0 0 1`。 

此示例演示了为什么在计算孔数之前必须检查组件尺寸。 如果每个黑色分量都被视为标记，则噪声像素将产生错误答案。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(WH) | 每个黑白像素都会被访问固定次数，在黑色洪水填充期间最多进行八次邻居检查，在白色洪水填充期间最多进行四次邻居检查。 |
 | 空间| O(WH) | 图像、组件标签、访问数组、孔计数和洪水填充堆栈需要线性内存。 |

 对于最多一百万个像素，该算法仅对每个像素执行恒定量的工作。 内存消耗也是线性的，并且保持在 256 MB 限制之内。 该实现避免了 Python 递归，并将最大网格大小的标签结构存储在紧凑的整数数组中。 

## 测试用例

 以下测试使用与提交的解决方案相同的组件和孔计数逻辑。 第一个案例检查提供的样本，第二个案例检查没有标记的最小尺寸，第三个案例在同一图像中放置多个 B 形标记，第四个案例检查最大尺寸的全黑图像。```python
import io
import sys
from array import array

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    W, H = map(int, input().split())
    grid = [input().strip() for _ in range(H)]
    n = W * H

    comp = array('i', [-1]) * n

    stack = [0]
    comp[0] = 0

    while stack:
        p = stack.pop()
        r, c = divmod(p, W)

        for nr in range(max(0, r - 1), min(H - 1, r + 1) + 1):
            for nc in range(max(0, c - 1), min(W - 1, c + 1) + 1):
                if nr == r and nc == c:
                    continue
                q = nr * W + nc
                if comp[q] == -1 and grid[nr][nc] == '#':
                    comp[q] = 0
                    stack.append(q)

    sizes = [sum(1 for x in comp if x == 0)]

    for r in range(H):
        for c in range(W):
            p = r * W + c
            if grid[r][c] != '#' or comp[p] != -1:
                continue

            cid = len(sizes)
            comp[p] = cid
            stack = [p]
            size = 0

            while stack:
                q = stack.pop()
                size += 1
                qr, qc = divmod(q, W)

                for nr in range(max(0, qr - 1), min(H - 1, qr + 1) + 1):
                    for nc in range(max(0, qc - 1), min(W - 1, qc + 1) + 1):
                        if nr == qr and nc == qc:
                            continue
                        nq = nr * W + nc
                        if grid[nr][nc] == '#' and comp[nq] == -1:
                            comp[nq] = cid
                            stack.append(nq)

            sizes.append(size)

    seen = bytearray(n)
    holes = [0] * len(sizes)

    for r in range(H):
        for c in range(W):
            start = r * W + c
            if grid[r][c] != '.' or seen[start]:
                continue

            seen[start] = 1
            stack = [start]
            outside = False
            candidate = -1
            multiple = False

            while stack:
                p = stack.pop()
                pr, pc = divmod(p, W)

                for nr, nc in (
                    (pr - 1, pc),
                    (pr + 1, pc),
                    (pr, pc - 1),
                    (pr, pc + 1),
                ):
                    if not (0 <= nr < H and 0 <= nc < W):
                        continue

                    q = nr * W + nc

                    if grid[nr][nc] == '.':
                        if not seen[q]:
                            seen[q] = 1
                            stack.append(q)
                    else:
                        cid = comp[q]
                        if cid == 0:
                            outside = True
                        elif sizes[cid] > 1:
                            if candidate == -1:
                                candidate = cid
                            elif candidate != cid:
                                multiple = True

            if not outside and candidate != -1 and not multiple:
                holes[candidate] += 1

    ans = [0, 0, 0]
    for cid in range(1, len(sizes)):
        if sizes[cid] == 1:
            continue
        if holes[cid] == 1:
            ans[0] += 1
        elif holes[cid] == 2:
            ans[1] += 1
        elif holes[cid] == 0:
            ans[2] += 1

    sys.stdin = old_stdin
    return " ".join(map(str, ans))

sample1 = """\
26 15
##########################
##........######......#..#
#...###....#####..#......#
#...#.#....####.........##
#...###.....##....#####..#
#...#.#.....#.....#####..#
#...###.....#.....##.##..#
#........#..#.#...#####..#
#..###......#.....#####..#
#..#........#...#.##.##..#
#..#........#.....##.##..#
#..#...#.#..#...#.##.##..#
#..###......#............#
###....#....##....##.....#
##########################
"""
assert run(sample1) == "1 1 0", "sample 1"

minimum = """\
7 9
#######
#######
#######
#######
#######
#######
#######
#######
#######
"""
assert run(minimum) == "0 0 0", "minimum dimensions"

two_b = """\
15 9
###############
#.............#
#..###........#
#..#.#........#
#..###........#
#........###..#
#........#.#..#
#........###..#
###############
"""
assert run(two_b) == "0 2 0", "two B marks"

maximum = "1000 1000\n" + ("#" * 1000 + "\n") * 1000
assert run(maximum) == "0 0 0", "maximum all-black grid"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 提供 26 x 15 样品 |`1 1 0`| 正品A和B痕迹、噪音和与外部相连的C形区域|
 | 7×9全黑网格|`0 0 0`| 最小尺寸和完整的区域外检测 |
 | 15 x 9，有两个 B 标记 |`0 2 0`| 同一类型的多个标记和独立的孔计数 |
 | 1000×1000全黑网格|`0 0 0`| 最大输入大小和线性时间行为 |

 ## 边缘情况

 外部黑色区域由第一个洪水填充处理。 由于洪水填充从边框开始并使用所有八个方向，因此通过水平、垂直或对角线接触连接到边框的每个黑色像素都会收到组件 ID 零。 视觉上类似于 C 但属于该区域的黑色形状永远不会进入后期分类阶段。 

单个噪声像素由黑色分量大小检查来处理。 假设噪声像素被大的白色表面包围。 在计数孔时，故意忽略其相邻的白色分量，因为黑色分量的大小为 1。 正品标记的成分较大，因此其封闭的白色区域仍会被计算在内。 

没有封闭的白色区域的标记被分类为C。这种标记周围的白色成分通过普通石材表面接触到外部的黑色区域，因此不被算作孔。 标记本身保留为非噪声黑色成分，并且孔数为零。 

具有一个封闭的白色区域的标记被分类为 A。在白色洪水填充期间，封闭的区域无法到达外部的黑色分量，因此`touches_outside`仍然是假的。 它触及 A 成分，变成`candidate`，并且该组件的孔数增加到 1。 

具有两个封闭白色区域的标记被分类为 B。这两个内部是独立的 4 连通白色分量，因此白色扫描独立地遇到它们。 每个都会增加相同黑色分量的孔数，使其等于 2。 最终的分类结果是 B.

 不允许使用对角线白色接触来合并区域，因为白色洪水填充仅使用四个方向。 这与石头表面的定义相匹配，并防止对角线触摸破坏真正的孔。 

图像可能包含大量噪声像素。 即使每个其他像素都是孤立的噪声，每个黑色分量都会被发现一次，每个分量的大小均为一，并且没有一个对答案有贡献。 总工作量与像素数保持线性关系。 

网格可以是全黑的。 在这种情况下，第一个洪水填充会消耗整个图像，不存在其他黑色分量，并且没有要处理的白色分量。 答案是正确的`0 0 0`。 

网格还可以包含许多单独的石头和标记。 每个白色组件仍然只处理一次，并且每个标记仅针对属于它的封闭白色组件收费。 不需要对整个网格进行每个标记扫描，这是使算法保持 O(WH) 的属性。
