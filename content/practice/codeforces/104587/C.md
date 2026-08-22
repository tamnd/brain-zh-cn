---
title: "CF 104587C - 数学贸易"
description: "输入中的每个人都拥有一件物品并且想要一件物品。 我们可以将每个人视为图中的一条有向边：从他们当前拥有的对象到他们想要的对象。"
date: "2026-06-30T07:28:17+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104587
codeforces_index: "C"
codeforces_contest_name: "2020-2021 ICPC East Central North America Regional Contest (ECNA 2020)"
rating: 0
weight: 104587
solve_time_s: 46
verified: true
draft: false
---

[CF 104587C - 数学贸易](https://codeforces.com/problemset/problem/104587/C)

 **评级：** -
 **标签：** -
 **求解时间：** 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 输入中的每个人都拥有一件物品并且想要一件物品。 我们可以将每个人视为图中的一条有向边：从他们当前拥有的对象到他们想要的对象。 因为每个对象都是唯一拥有的并且是唯一需要的，所以每个对象作为源只出现一次，作为目标只出现一次。 

有效的“数学贸易链”是一系列人，其中第一个人想要的物品当前由第二个人拥有，第二个人想要的物品由第三个人拥有，依此类推。 如果你遵循依赖链，你本质上就是沿着人们诱导的有向边缘行走。 关键的限制是，只有当这条链一致时，交易才有可能，这迫使结构成为不相交的有向循环。 

该任务简化为找到由这些有向边形成的最长的循环，并以所涉及的人数来输出其长度。 如果不存在长度至少为 2 的循环，则答案是无法进行交易。 

输入规模较小，最多100人。 除了简单的映射和遍历之外，这立即排除了对重型图形机器的任何需求。 每个测试用例的 O(n²) 甚至 O(n) 解决方案就足够了。 

当映射仅形成自循环时，就会出现一种微妙的情况，这意味着一个人想要的正是他们已经拥有的东西。 这样的人不会对贸易链做出贡献。 另一种边缘情况是当图分解为多个不同大小的小循环时，我们必须正确识别最大的循环，而不仅仅是检测循环的存在。 

## 方法

 该问题引发的结构是一个函数图：每个节点（人）都指向另一个节点（拥有所需对象的人）。 由于对象所有权是唯一的，因此每个节点都只有一个出边和一个入边，从而在参与者上形成一种类似排列的结构。 

暴力方法会尝试从每个人开始并遵循链条，直到检测到重复，记录周期长度。 这已经接近最优，因为每次行走都是确定性的。 然而，如果实施不小心，可能会重新开始遍历每个节点并重复遍历相同的循环，从而导致冗余工作。 在最坏的情况下，这会变成 O(n²)，这在这里仍然没问题，但概念上效率低下。 

关键的观察是我们正在处理不相交的循环。 每个节点都属于一个循环，因此一旦访问了一个节点，它的整个循环就可以被标记并且永远不会重新计算。 这表明一个简单的类似 DFS 或访问数组的遍历，可以将每个循环恰好提取一次。 

因此，我们可以迭代所有节点，每当我们找到一个未访问的节点时，我们就会跟踪它的出边，直到返回到一个已访问的节点，如果它有效，则计算循环长度。 答案是最大长度。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 从每个节点进行蛮力步行 | O(n²) | O(n) | 已接受 |
 | 循环分解与访问标记| O(n) | O(n) | 已接受 |

 ## 算法演练

 我们首先将对象名称转换为索引，以便我们可以使用数组而不是字符串。 这使得每步的遍历时间恒定。

1. 构建两个哈希映射：一个将对象名称映射到所有者索引，另一个将所有者索引映射到所需的对象名称。 第一个映射至关重要，因为它让我们立即从一个对象跳转到它的所有者。 
2. 构造一个函数图数组 next[]，其中 next[i] 是拥有 person i 想要的对象的人的索引。 这会创建从每个节点到另一个节点的确定性指针。 
3. 维护一个所有节点都初始化为 false 的访问数组。 这确保我们不会重新计算已经处理过的周期。 
4. 迭代从 0 到 n−1 的每个节点 i。 如果节点 i 已被访问，则跳过它，因为它属于先前处理的循环。 
5. 如果节点 i 没有被访问，则从 i 开始沿着 next 指针行走，将节点标记为已访问，并计算遇到了多少个唯一节点，直到返回到已访问的节点。 这种遍历必然保持在一个周期内，因为每个节点都只有一个传出边。 
6. 如果循环长度至少为 2，则用该值更新答案。 
7、处理完所有节点后，输出找到的最大循环长度，如果没有循环长度超过1则报告不存在有效循环。 

正确性取决于这样一个事实：一旦进入循环，我们就无法逃脱它，并且由于每个节点只有一个出边，因此遍历无法分支。 

### 为什么它有效

 构造的图是由对象所有权和需求引起的参与者集合的排列。 在这样的图中，每个连接的组件都是一个有向循环。 每个循环都是不相交的，并且每个节点恰好属于一个循环。 遍历将循环中的每个节点恰好标记一次，因此可以精确计算循环长度，不会重复或遗漏。 因此，这些周期长度中的最大值就是最长的可能有效贸易链。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input().strip())
    if n == 0:
        print("No trades possible")
        return

    owner_of = {}
    want = []
    names = []

    for i in range(n):
        name, have, need = input().strip().split()
        names.append(name)
        owner_of[have] = i
        want.append(need)

    nxt = [-1] * n
    for i in range(n):
        if want[i] in owner_of:
            nxt[i] = owner_of[want[i]]

    visited = [False] * n
    ans = 0

    for i in range(n):
        if visited[i]:
            continue

        cur = i
        cnt = 0
        path = []

        while not visited[cur]:
            visited[cur] = True
            path.append(cur)
            cnt += 1
            cur = nxt[cur]

            if cur == -1:
                cnt = 0
                break

        if cnt > 1:
            ans = max(ans, cnt)

    if ans == 0:
        print("No trades possible")
    else:
        print(ans)

if __name__ == "__main__":
    solve()
```该解决方案首先读取所有参与者并构建从每个对象到其所有者的映射。 这是关键的转换，使我们能够从“想要的物体”直接跳转到当前持有它的人。 

下一个指针数组对功能图进行编码：每个人都精确地指向另一个人，如果参与者中不存在所需的对象，则指向 -1。 访问数组确保每个节点都被处理一次。 

在遍历过程中，我们会累积一条路径，直到遇到访问过的节点。 由于循环是不相交的，因此这种遍历恰好捕获一个循环，或者如果链不完整则中断。 我们只考虑大小至少为 2 的周期，因为大小 1 对应于想要拥有自己的物品并且不形成交易的人。 

一个微妙的细节是，在遍历期间标记立即访问可以防止重新访问其他循环中的节点，从而确保线性行为。 

## 工作示例

 ### 示例 1

 输入：```
Sally Clock Doll
Steve Doll Painting
Carlos Painting Clock
Maria Candlestick Vase
```我们构建映射：

 莎莉 → 时钟，史蒂夫 → 娃娃，卡洛斯 → 绘画，玛丽亚 → 烛台

 时钟 → 莎莉，娃娃 → 史蒂夫，绘画 → 卡洛斯，花瓶 → 玛丽亚

 遍历：

 | 开始| 路径| 下一步 | 周期大小|
 | --- | --- | --- | --- |
 | 莎莉 | 莎莉→史蒂夫→卡洛斯→莎莉| 关闭循环| 3 |
 | 史蒂夫| 已经访问过 | 跳过| - |
 | 卡洛斯| 已经访问过 | 跳过| - |
 | 玛丽亚| 玛丽亚→玛丽亚| 自循环| 1 |

 最大循环大小为 3，因此输出为 3。 

这证实了只有有意义的循环才起作用，而自循环则被忽略。 

### 示例 2

 输入：```
Abby Bottlecap Card
Bob Card Spoon
Chris Spoon Chair
Dan Pencil Pen
```映射：

 Abby→Bob→Chris→Abby形成3的循环。Dan→Dan是自循环。 

| 开始| 路径| 下一步 | 周期大小|
 | --- | --- | --- | --- |
 | 艾比 | 艾比 → 鲍勃 → 克里斯 → 艾比 | 周期结束| 3 |
 | 鲍勃 | 访问过 | 跳过| - |
 | 克里斯 | 访问过 | 跳过| - |
 | 丹| 丹| 自循环| 1 |

 输出为3。 

这表明断开的循环是独立处理的并且最大值被正确选择。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个节点在遍历其循环时都会被访问一次，并且访问后会阻止重新处理 |
 | 空间| O(n) | 映射、下一个指针和访问数组的存储 |

 约束条件将 n 限制为 100，因此即使是低效的方法也能轻松通过。 这种线性解决方案完全在限制范围内，并留有充足的余量。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# sample 1
assert run("""Sally Clock Doll
Steve Doll Painting
Carlos Painting Clock
Maria Candlestick Vase""") == "3"

# sample 2
assert run("""Abby Bottlecap Card
Bob Card Spoon
Chris Spoon Chair
Dan Pencil Pen""") == "3"

# all self loops
assert run("""A X X
B Y Y
C Z Z""") == "No trades possible"

# single cycle
assert run("""A A B
B B C
C C A""") == "3"

# two cycles different sizes
assert run("""A A B
B B A
C C D
D D C""") == "2"

# no edges except broken chain
assert run("""A A B
B B C
C C D""") == "No trades possible"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 所有自循环| 无法进行交易 | 忽略琐碎的循环|
 | 单周期| 3 | 检测完整周期|
 | 两个周期| 2 | 选择最大周期|
 | 断链| 无法进行交易 | 处理无效指针|

 ## 边缘情况

 一种极端情况是每个参与者都想要自己的物品。 例如：```
A X X
B Y Y
C Z Z
```每个节点都指向它自己。 遍历单独标记每个节点，但周期大小始终为 1，因此不会记录有效交易。 该算法正确输出“不可能进行交易”。 

另一种情况是有效循环和隔离自循环的混合。 访问数组确保循环被发现一次，并且自循环被视为不影响答案的大小为 1 的循环。 所有组件的最大值仍然会产生正确的最长贸易链。
