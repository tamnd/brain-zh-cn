---
title: "CF 102638D - 分布式计算"
description: "该系统是一个由 CPU 组成的三维网格。 工作中的CPU只能在每个轴的正方向上发送信息，这意味着CPU可以移动到其邻居，坐标加一。 通信图中不存在损坏的 CPU。"
date: "2026-08-02T14:46:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102638
codeforces_index: "D"
codeforces_contest_name: "Bredor contest"
rating: 0
weight: 102638
solve_time_s: 96
verified: true
draft: false
---

[CF 102638D - 分布式计算](https://codeforces.com/problemset/problem/102638/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 36s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 该系统是一个由 CPU 组成的三维网格。 工作中的CPU只能在每个轴的正方向上发送信息，这意味着CPU可以移动到其邻居，坐标加一。 通信图中不存在损坏的 CPU。 

当仅移除某个正在工作的 CPU 会破坏两个其他 CPU 之间的至少一个现有通信关系时，该 CPU 被称为关键 CPU。 换句话说，必须有一些正在工作的 CPU 在删除之前存在一条路径，但每个可能的路径都使用删除的 CPU。 任务是统计有多少个 CPU 具有此属性。 

每个网格的维数可以达到100，因此单元总数可以达到100万。 这排除了在移除每个 CPU 后尝试运行完整图形搜索的可能性。 在整个网格上进行一次广度优先搜索已经大约需要一百万次操作，而对每个单元重复该搜索将需要大约一万亿次操作。 该解决方案只需检查每个 CPU 固定次数。 

主要的边缘情况来自以下事实：CPU 可能看起来周围有几条路线，但由于网格方向或损坏的 CPU，这些路线可能不存在。 例如：```
1 1 3
111
```中间的CPU很关键。 删除它会使第一个 CPU 无法控制第三个 CPU。 正确的输出是：```
1
```如果粗心的解决方案只检查 CPU 是否有两个邻居，则可能会错过这一点，因为没有二维绕道。 

另一种情况是：```
1 2 2
11
11
```右上方的CPU并不重要。 在考虑方向之前，有两种可能的方式从左下 CPU 到右上 CPU，但是对于允许的方向，唯一有意义的问题是是否存在另一条单调路线。 正确的输出是：```
0
```实现必须尊重运动的有向性质，而不是将网格视为无向图。 

# 方法

 一种直接的方法是一次删除每个正在工作的 CPU，并运行可达性搜索以查找是否有任何通信对消失。 这是正确的，因为它完全模拟了关键 CPU 的定义。 然而，在最大的网格中，有 100 万个 CPU。 对每个节点运行超过一百万个节点的搜索可以得到大约$10^{12}$工作，远远超出了极限。 

关键的观察结果是，进入 CPU 的每条路径都必须经过其三个可能的前任者之一，而离开 CPU 的每条路径都必须经过其三个可能的后继者之一。 如果 CPU 至关重要，则必须存在一些前驱和后继对，它们之间的所有路径都经过 CPU。 

这样的前任和后继者之间的距离是极其微小的。 前任比CPU落后一步，后继比CPU领先一步。 如果它们位于同一轴上，则 CPU 是唯一可能的中间单元。 如果它们使用不同的轴，则恰好有一个可能的替代中间单元，即小二乘一矩形的角。 检查那个角是否存在就足够了。 

这将整个问题简化为检查每个 CPU 最多九个本地配置。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nmk · nmk) | O(nmk · nmk) | O(nmk) | 太慢了 |
 | 最佳| O(nmk) | O(nmk) | 已接受 |

 # 算法演练

 1. 存储工作和损坏的 CPU 的网格。 对于每个正在工作的 CPU，只有其六个相邻位置很重要，因为通信可以通过这些相邻单元进出。 
2. 对于每个工作CPU，收集工作前任和工作后继的方向。 前驱具有在轴的负方向上一步的形式，后继具有在轴的正方向上一步的形式。 
3. 尝试每一对前驱和后继。 如果两者使用同一个轴，前驱只能通过当前CPU到达后继，所以CPU至关重要。 
4. 如果前驱和后驱使用不同的轴，则计算唯一可能的绕行小区。 如果该单元损坏或超出网格，则当前的 CPU 就很关键。 否则，绕行提供了另一条路径，并且这对路径并不能证明其重要性。 
5. 如果至少一对前驱和后继证明它们之间的每条路径都使用 CPU，则计算 CPU。 

这样做的原因是进入和离开单个 CPU 的路径具有本地结构。 任何使用CPU的通信路径必须从一个相邻的前任者进入并离开到一个相邻的后继者。 唯一可能的旁路必须安装在连接这两个单元的最小矩形内，并且该矩形最多有一个其他中间单元。 检查单元是否覆盖了所有可能的替代路径。 

# Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m, k = map(int, input().split())
    grid = []
    for i in range(n):
        while True:
            line = input().strip()
            if line:
                break
        grid.append([list(line)])
        for _ in range(m - 1):
            grid[i].append(list(input().strip()))

    def inside(x, y, z):
        return 0 <= x < n and 0 <= y < m and 0 <= z < k

    ans = 0

    dirs = [(1, 0, 0), (0, 1, 0), (0, 0, 1)]

    for x in range(n):
        for y in range(m):
            for z in range(k):
                if grid[x][y][z] != '1':
                    continue

                prevs = []
                nexts = []

                for idx, (dx, dy, dz) in enumerate(dirs):
                    px, py, pz = x - dx, y - dy, z - dz
                    nx, ny, nz = x + dx, y + dy, z + dz

                    if inside(px, py, pz) and grid[px][py][pz] == '1':
                        prevs.append(idx)
                    if inside(nx, ny, nz) and grid[nx][ny][nz] == '1':
                        nexts.append(idx)

                critical = False

                for a in prevs:
                    if critical:
                        break
                    for b in nexts:
                        if a == b:
                            critical = True
                            break

                        dx1, dy1, dz1 = dirs[b]
                        dx2, dy2, dz2 = dirs[a]

                        cx = x - dx2 + dx1
                        cy = y - dy2 + dy1
                        cz = z - dz2 + dz1

                        if not inside(cx, cy, cz) or grid[cx][cy][cz] == '0':
                            critical = True
                            break

                if critical:
                    ans += 1

    print(ans)

if __name__ == "__main__":
    solve()
```输入解析器会跳过分隔层的空行。 网格是直接存储的，因此每次邻居查找都是恒定时间。 

对于每个单元格，`prevs`和`nexts`仅包含可以参与通过单元的通信路径的工作邻居。 每个迭代的数量永远不会超过三个，因此嵌套检查最多执行九次迭代。 

绕行计算是微妙的部分。 假设前驱方向为 x 轴，后继方向为 y 轴。 唯一的替代路线必须先沿 y 移动，然后沿 x 移动，因此它会穿过对角。 该公式精确地计算了该角点。 不需要搜索，因为前一个和后一个之间的坐标差只有两个单位移动。 

# 工作示例

 对于完整的三乘三乘三立方体，请考虑使用中间的 CPU。 

| 当前CPU | 前任方向| 继任者方向 | 替代电池| 结果 |
 | --- | --- | --- | --- | --- |
 | (2,2,2) | (2,2,2) | x| x| 无 | 关键|
 | (2,2,2) | (2,2,2) | x| y | (2,1,2)| 不足以证明关键|

 CPU 在同一轴上有对，例如沿 x 方向位于其前面的 CPU 和位于其后面的 CPU。 删除它会阻塞直接的通信路径。 重复这个推理将每个非角落 CPU 标记为关键。 

对于三个 CPU 的线路：```
1 1 1
```痕迹是：

 | 当前CPU | 前辈| 继任者| 决定|
 | --- | --- | --- | --- |
 | 第一| 无 | 中| 不重要|
 | 中| 第一| 最后| 关键|
 | 最后 | 中| 无 | 不重要|

 该示例说明了无法对端点进行计数的原因。 关键 CPU 需要源端和目标端都失去通信。 

# 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(nmk) | 每个 CPU 检查恒定数量的邻居和对。 |
 | 空间| O(nmk) | 网格本身被存储。 |

 最大可能的网格包含一百万个单元。 该算法仅对每个单元执行少量固定工作，因此它符合预期限制。 

# 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().splitlines()
    sys.stdin = old

    it = iter(data)
    n, m, k = map(int, next(it).split())
    grid = []
    for _ in range(n):
        while True:
            s = next(it)
            if s:
                break
        grid.append([list(s)])
        for _ in range(m - 1):
            grid[-1].append(list(next(it)))

    def inside(x, y, z):
        return 0 <= x < n and 0 <= y < m and 0 <= z < k

    dirs = [(1,0,0),(0,1,0),(0,0,1)]
    ans = 0

    for x in range(n):
        for y in range(m):
            for z in range(k):
                if grid[x][y][z] != '1':
                    continue
                p = []
                q = []
                for i, (dx,dy,dz) in enumerate(dirs):
                    if inside(x-dx,y-dy,z-dz) and grid[x-dx][y-dy][z-dz]=='1':
                        p.append(i)
                    if inside(x+dx,y+dy,z+dz) and grid[x+dx][y+dy][z+dz]=='1':
                        q.append(i)
                ok = False
                for a in p:
                    for b in q:
                        if a == b:
                            ok = True
                        else:
                            dx1,dy1,dz1 = dirs[b]
                            dx2,dy2,dz2 = dirs[a]
                            cx,cy,cz = x-dx2+dx1, y-dy2+dy1, z-dz2+dz1
                            if not inside(cx,cy,cz) or grid[cx][cy][cz]=='0':
                                ok = True
                        if ok:
                            break
                    if ok:
                        break
                ans += ok
    return str(ans) + "\n"

assert run("""1 1 3
111
""") == "1\n", "line middle"

assert run("""3 3 3
111
111
111
111
111
111
111
111
111
""") == "19\n", "full cube"

assert run("""1 1 10
0101010101
""") == "0\n", "isolated CPUs"

assert run("""1 1 1
1
""") == "0\n", "single CPU"

assert run("""1 2 2
11
11
""") == "0\n", "small square"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 三个CPU排成一行| 1 | 中电池隔板检测|
 | 全3D立方体| 19 | 19 密集网格行为 |
 | 交替工作单元 | 0 | 没有通讯路径 |
 | 一个CPU | 0 | 最小尺寸边界 |
 | 两层两层| 0 | 绕行处理|

 # 边缘情况

 对于直线：```
1 1 3
111
```中间的CPU在同一轴上有一个前任和一个后继。 该算法发现不存在可能的绕行单元并对其进行计数。 

对于单个隔离工作 CPU：```
1 1 1
1
```没有前任，也没有后继者。 由于无法破坏任何通信关系，因此该算法使答案保持不变。 

对于交替细胞：```
1 1 10
0101010101
```每个工作的 CPU 都缺少所需的相邻对。 该算法永远不会找到前驱和后继组合，因此输出保持为零。 

对于密集立方体，每个内部 CPU 至少有一对直接的前任后继者。 该算法不需要检查整个图，因为局部直线路径已经足以证明关键性。
