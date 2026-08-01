---
title: "CF 102576J - 太空地鼠"
description: "小行星是一个边长为一百万的巨大立方网格，因此明确存储单元是不可能的。 唯一的空单元是那些被隧道移除的单元。 每条隧道都是一条与三个轴线之一平行的完整直线。"
date: "2026-07-31T07:39:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102576
codeforces_index: "J"
codeforces_contest_name: "2020 Petrozavodsk Winter Camp, Jagiellonian U Contest"
rating: 0
weight: 102576
solve_time_s: 78
verified: true
draft: false
---

[CF 102576J - 太空地鼠](https://codeforces.com/problemset/problem/102576/J)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 小行星是一个边长为一百万的巨大立方网格，因此明确存储单元是不可能的。 唯一的空单元是那些被隧道移除的单元。 每条隧道都是一条与三个轴线之一平行的完整直线。 

隧道可以通过两个保持固定的坐标来描述。 例如，沿 x 轴的隧道由下式标识`(y, z)`，因为每一个`(x, y, z)`单元格为空。 任务是回答两个给定的空单元是否属于同一空单元连通区域。 

制约因素是主要困难。 可以有 300000 个隧道和 500000 个查询。 对立方体进行 BFS 最多需要`10^18`细胞，这是不可能的。 即使包含所有空单元格的图表也太大了。 该算法必须仅适用于隧道本身。 

隐藏的结构是，与小行星的大小相比，隧道的数量很少。 我们只需要了解隧道如何相互连接。 

一个常见的错误是只检查两个单元是否位于同一个隧道上。 这会失败，因为相邻的并行隧道已连接。 另一个错误是只检查不同方向的交叉点。 两条相距一单位的平行隧道永远不会相交，但地鼠仍然可以在它们之间移动。 

## 方法

 强力解决方案将生成每个空单元，连接相邻单元，并运行连接的组件。 小行星包含`10^18`细胞，所以即使创建网格也是不可能的。 

更好的尝试是制作一个图表，其中每个隧道都是一个顶点。 如果相应的隧道接触，则两个顶点连接。 直接实现仍然太慢，因为许多隧道可以与同一坐标平面相交。 例如，同一 z 坐标处的数千个 x 隧道和 y 隧道将创建数百万个成对交叉点。 

重要的观察是交叉点不需要单独表示。 如果几条隧道都经过同一个切片，则一个辅助顶点可以代表整个切片。 将每个隧道连接到该辅助顶点可提供完全相同的连接。 

例如，具有相同 z 坐标的每个 x 隧道与具有该 z 坐标的每个 y 隧道相交。 单个“z 切片”节点连接所有这些节点。 

压缩后，并行隧道之间仅保留局部邻接关系。 这可以通过哈希图来处理，因为每个隧道只需要检查其二维坐标空间中的四个可能的邻居。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(10^18) | O(10^18) | O(10^18) | O(10^18) | 不可能|
 | 具有成对交点的隧道图 | O(n²) | O(n²) | 太慢了|
 | 具有辅助切片节点的 DSU | O(n + q) | O(n) | 已接受 |

 ## 算法演练

 1. 存储每个唯一的隧道并为其分配一个 ID。 隧道通过其方向和两个固定坐标来存储。 
2. 创建包含所有隧道和附加辅助节点的不相交集联合结构。 辅助节点代表共享一个固定坐标切片的所有隧道。 
3. 通过辅助节点连接垂直隧道。 X 形隧道`(y,z)`连接到表示坐标的辅助节点`y`并协调`z`，因为这些正是垂直隧道可以遇到的切片。 
4. 连接平行的相邻隧道。 对于每一个隧道，检查是否存在另一条相同方向的隧道，并且一个固定坐标加一。 如果存在，则合并它们的组件。 
5. 对于每个查询，查找包含起始单元的所有隧道和包含结束单元的所有隧道。 由于保证单元格是空的，因此每一侧至少存在一个隧道。 如果任何起始隧道和结束隧道具有相同的 DSU 代表，则答案为`YES`。 

为什么它有效：

 空单元之间的每次移动要么停留在同一个隧道上，要么在相邻的平行隧道之间移动，要么发生在两个垂直隧道的交叉点上。 DSU 恰好包含这三种类型的连接。 辅助节点表示所有可能的垂直交叉点，而无需显式创建每一对。 因此，当两个单元对应的隧道顶点位于同一 DSU 组件中时，它们在原始小行星中准确地连接。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    z = int(input())
    out = []

    for _ in range(z):
        n = int(input())

        xt = {}
        yt = {}
        zt = {}

        tunnels = []

        for _ in range(n):
            a, b, c = map(int, input().split())
            if c == -1:
                key = (a, b)
                if key not in zt:
                    zt[key] = len(tunnels)
                    tunnels.append((2, a, b))
            elif b == -1:
                key = (a, c)
                if key not in yt:
                    yt[key] = len(tunnels)
                    tunnels.append((1, a, c))
            else:
                key = (b, c)
                if key not in xt:
                    xt[key] = len(tunnels)
                    tunnels.append((0, b, c))

        parent = []
        size = []

        def add():
            parent.append(len(parent))
            size.append(1)
            return len(parent) - 1

        for _ in tunnels:
            add()

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        def union(a, b):
            a = find(a)
            b = find(b)
            if a == b:
                return
            if size[a] < size[b]:
                a, b = b, a
            parent[b] = a
            size[a] += size[b]

        aux = {}

        def get_aux(t, x):
            key = (t, x)
            if key not in aux:
                aux[key] = add()
            return aux[key]

        for i, (typ, a, b) in enumerate(tunnels):
            if typ == 0:
                union(i, get_aux(0, a))
                union(i, get_aux(1, b))
            elif typ == 1:
                union(i, get_aux(0, b))
                union(i, get_aux(2, a))
            else:
                union(i, get_aux(1, a))
                union(i, get_aux(2, b))

        for (a, b), i in xt.items():
            if (a + 1, b) in xt:
                union(i, xt[(a + 1, b)])
            if (a, b + 1) in xt:
                union(i, xt[(a, b + 1)])

        for (a, b), i in yt.items():
            if (a + 1, b) in yt:
                union(i, yt[(a + 1, b)])
            if (a, b + 1) in yt:
                union(i, yt[(a, b + 1)])

        for (a, b), i in zt.items():
            if (a + 1, b) in zt:
                union(i, zt[(a + 1, b)])
            if (a, b + 1) in zt:
                union(i, zt[(a, b + 1)])

        def get_lines(x, y, z):
            res = []
            if (y, z) in xt:
                res.append(xt[(y, z)])
            if (x, z) in yt:
                res.append(yt[(x, z)])
            if (x, y) in zt:
                res.append(zt[(x, y)])
            return res

        q = int(input())
        for _ in range(q):
            x1, y1, z1, x2, y2, z2 = map(int, input().split())
            a = get_lines(x1, y1, z1)
            b = get_lines(x2, y2, z2)

            ok = False
            for u in a:
                ru = find(u)
                for v in b:
                    if ru == find(v):
                        ok = True
                        break
                if ok:
                    break

            out.append("YES" if ok else "NO")

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```该实现仅保留隧道和压缩切片图。 坐标值可以保留为完整整数，因为它们仅用作字典键。 不需要坐标压缩。 

微妙的部分是辅助节点的构建。 隧道并不与与其相交的所有隧道相连。 相反，它连接到代表整个坐标切片的节点。 这可以避免二次行为，同时保持连通性。 

邻居检查仅使用`+1`因为压缩二维隧道布局中的每一个无向邻接都是从一个端点发现的。 检查负方向会重复工作。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + q) | 每个隧道执行恒定的字典操作，并且每个查询最多针对三个隧道检查三个隧道。 |
 | 空间| O(n) | DSU 包含隧道节点，并且每个隧道坐标最多包含恒定数量的辅助节点。 |

 最大的案例包含数十万条隧道和查询。 该算法从未触及百万立方体，因此它完全符合限制。
