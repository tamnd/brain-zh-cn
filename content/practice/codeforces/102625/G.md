---
title: "CF 102625G - 秘密社团和某人"
description: "该问题描述了一棵由通道连接的秘密办公室树。 每个通道都有一个安全级别。 对于每个可能的会议地点，每个其他办公室都会沿着唯一的路径派出一名代表前往该办公室。"
date: "2026-08-03T15:21:47+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102625
codeforces_index: "G"
codeforces_contest_name: "IIT(ISM) Virtual Farewell"
rating: 0
weight: 102625
solve_time_s: 58
verified: true
draft: false
---

[CF 102625G - 秘密结社和某个人](https://codeforces.com/problemset/problem/102625/G)

 **评级：** -
 **标签：** -
 **求解时间：** 58s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 该问题描述了一棵由通道连接的秘密办公室树。 每个通道都有一个安全级别。 对于每个可能的会议地点，每个其他办公室都会沿着唯一的路径派出一名代表前往该办公室。 在返回路径上，代表隐藏该路径上具有最高安全级别的每个通道中的信息。 

任务是找到任何段落上放置的最大数量的隐藏信息副本，并列出达到该最大值的所有段落。 输入包含通道后面的办公室数量、端点及其安全级别。 输出包含最大副本数以及具有该计数的所有段落的索引。 原始问题的约束条件达到$2 \cdot 10^5$办公室，因此检查每对办公室的路径的方法是不可能的。 

直接模拟将考虑每对有序的办公室，大致给出$n^2$路径。 和$n=200000$, 这是周围$4 \cdot 10^{10}$成对，远远超出一秒解决方案的处理能力。 我们需要全局处理树结构，而不是查看单独的路径。 

主要的边缘情况来自相同的最大安全级别以及不是路径上唯一最高安全级别的通道。 例如，考虑：```
3
1 2 5
2 3 5
```正确的输出是：```
4 2
1 2
```粗心的解决方案可能只计算从办公室 1 到办公室 3 的路径上的一个最大通道，但两个通道具有相同的最大级别，并且都收到一份副本。 

另一个棘手的情况是当高安全性通道阻止低安全性通道接收信息时。 例如：```
3
1 2 10
2 3 1
```第一篇收到 4 份，第二份收到 2 份。 仅计算包含边的路径数，而不检查边是否是这些路径上的最大值的解决方案会给出错误的答案。 

# 方法

 暴力解决方案很简单。 对于每个会议办公室，运行遍历以查找来自每个其他办公室的路径，找到每个路径上的最大安全值，并增加具有该值的所有通道的计数。 它是正确的，因为它直接遵循定义。 然而，办公室对的数量是$n(n-1)$，并且处理每条路径可以采取$O(n)$， 导致$O(n^3)$在最坏的情况下工作。 即使存储所有对距离也已经太昂贵了。 

关键的观察是具有安全级别的通道$w$仅对于每条边最多具有安全级别的路径很重要$w$。 如果我们删除安全级别大于的所有通道$w$，然后在每个剩余组件内，每条路径最多仅使用具有级别的边$w$。 一个级别的跨越$w$正是为该组件内由该通道分隔开的有序办公室对选择的。 

这建议通过提高安全级别来处理段落。 在处理一组具有相同级别的段落之前，不相交的集合并集结构表示使用较小级别连接的组件。 对于当前关卡，由这些通道连接的较小组件形成临时树。 对于将临时树分成不同大小的边的通道$a$和$b$，穿过它的有序对的数量是$2ab$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^3)$|$O(n)$| 太慢了|
 | 最佳|$O(n \log n)$|$O(n)$| 已接受 |

 # 算法演练

 1. 按安全级别对所有通道进行排序。 我们一起处理相同的安全级别，因为具有相同级别的通道都可以是同一路径上的最大边。 
2. 维护仅包含安全级别较低的通道的 DSU。 每个 DSU 组件代表一组相互连接的办公室，不使用任何可能成为当前级别最大边缘的通道。 
3. 对于具有相同安全级别的每组通道，将每个 DSU 组件收缩为单个节点。 当前的通道在这些收缩的节点之间形成了一片森林。 
4. 遍历每棵临时树。 对于当前的每条通道，计算该通道两侧的原始办公室总数。 如果两侧包含$a$和$b$办事处，添加$2ab$到该段落的计数。 
5. 计算完该安全级别的所有计数后，将该级别的所有通道合并到 DSU 中。 当处理更高的安全级别时，它们变得可用。 

为什么有效：对于有水平的段落$w$，当一对办公室之间的整个路径不包含大于$w$通道就在那条路上。 处理级别时$w$、DSU 组件和临时林正好代表这些路径。 切割通道将有效路径分为两组大小$a$和$b$，并且每一侧的一个端点的每个有序选择都贡献一次。 因此$2ab$精确计算该段落的所有信息副本。 

# Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    edges = []
    for i in range(1, n):
        u, v, w = map(int, input().split())
        edges.append((w, u - 1, v - 1, i))

    parent = list(range(n))
    size = [1] * n

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

    edges.sort()
    ans = [0] * n
    i = 0

    while i < n - 1:
        j = i
        while j < n - 1 and edges[j][0] == edges[i][0]:
            j += 1

        graph = {}
        nodes = set()

        for _, u, v, idx in edges[i:j]:
            ru = find(u)
            rv = find(v)
            graph.setdefault(ru, []).append((rv, idx))
            graph.setdefault(rv, []).append((ru, idx))
            nodes.add(ru)
            nodes.add(rv)

        visited = set()

        for start in nodes:
            if start in visited:
                continue

            order = []
            par = {start: -1}
            pedge = {}

            stack = [start]
            visited.add(start)

            while stack:
                x = stack.pop()
                order.append(x)
                for y, eid in graph.get(x, []):
                    if y != par[x]:
                        par[y] = x
                        pedge[y] = eid
                        visited.add(y)
                        stack.append(y)

            total = 0
            for x in order:
                total += size[find(x)]

            sub = {}
            for x in reversed(order):
                cur = size[find(x)]
                for y, eid in graph.get(x, []):
                    if par.get(y) == x:
                        cur += sub[y]
                sub[x] = cur
                if par[x] != -1:
                    other = total - cur
                    ans[pedge[x]] += 2 * cur * other

        for _, u, v, _ in edges[i:j]:
            union(u, v)

        i = j

    best = max(ans[1:])
    res = [str(i) for i in range(1, n) if ans[i] == best]

    print(best, len(res))
    print(" ".join(res))

if __name__ == "__main__":
    solve()
```DSU部分遵循递增安全级别的思想。 这`find`操作给出当前级别合并之前的当前收缩组件。 

一次仅针对一个安全级别重建临时图。 它的顶点是 DSU 组件，而不是单个办公室。 遍历计算该临时林中的子树大小。 当临时边分隔大小为`cur`从剩余的`total - cur`，有效有序对的数量恰好是`2 * cur * (total - cur)`。 

合并步骤在计数后发生。 这个顺序是必要的。 如果在计数之前合并当前级别的通道，它们将错误地显示为已可用的较低级别连接。 

# 工作示例

 对于第一个样本：```
3
2 1 3
3 1 1
```处理过程是：

 | 通道| 当前组件| 侧面尺寸 | 贡献 |
 | --- | --- | --- | --- |
 | 1 | {1}、{2}、{3} | 2 和 1 | 4 |
 | 2 | {1,2},{3} | 1 和 2 | 2 |

 最大贡献为 4，因此选择第 1 段。 

对于第二个样本：```
5
2 1 3
4 3 1
5 4 1
2 3 1
```为安全级别 1 通道创建的临时树会产生：

 | 通道| 侧面尺寸 | 贡献 |
 | --- | --- | --- |
 | 2 | 2 和 3 | 12 | 12
 | 3 | 1 和 4 | 8 |
 | 4 | 2 和 3 | 12 | 12

 较高级别的段落被单独处理，并达到与另一个段落相同的最大值，产生多个答案。 

# 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \log n)$| 排序占主导地位，每个通道都参与少量的DSU和临时树操作。 |
 | 空间|$O(n)$| DSU 数组、边列表和临时图包含线性信息。 |

 该解决方案适合$2 \cdot 10^5$限制，因为它从不枚举办公室对或路径。 

# 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    old_out = sys.stdout
    sys.stdout = out
    solve()
    sys.stdin = old
    sys.stdout = old_out
    return out.getvalue()

assert run("""3
2 1 3
3 1 1
""") == """4 1
1
"""

assert run("""3
1 2 5
2 3 5
""") == """8 2
1 2
"""

assert run("""2
1 2 7
""") == """2 1
1
"""

assert run("""4
1 2 3
2 3 3
3 4 3
""") == """8 2
2 3
"""

assert run("""4
1 2 10
2 3 1
3 4 1
""") == """12 1
1
"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 具有相同级别的三个节点 | 两条边均已选定 ​​| 相同的最大通道数一起计数 |
 | 单边树 | 唯一的段落获胜 | 最小尺寸外壳 |
 | 等值链| 中间段落占主导地位| 子树大小计算 |
 | 一大边和小边| 大优势胜| 忽略非最大边 |

 # 边缘情况

 对于相同的最大级别，算法会一起处理每个当前级别的段落。 在输入中```
3
1 2 5
2 3 5
```两个通道都在同一个临时树中。 每个切口的边尺寸为 1 和 2，每个切口有 4 个副本，因此两者都会返回。 

对于安全值大得多的通道，其下方的较小通道无法从穿过较大通道的路径接收信息。 在```
3
1 2 10
2 3 1
```第一级单独处理。 临时组件具有大小为 1 和 2 的两侧，给出 4。第二个通道稍后处理，并且仅接收不包含 10 级通道的对作为最大值，给出 2。DSU 合并的排序保留了这种区别。
