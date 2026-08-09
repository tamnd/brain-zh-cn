---
title: "CF 102458B - 丹尼尔和游戏秀"
description: "该图是一棵树，因为它有 (n) 个顶点，并且在连接时恰好有 (n-1) 个边。 每条边都有一个韧性 (a)，这意味着 Daniel 在他的回合中最多可以跨越该边 (a) 次。 他选择一个起始顶点（R），或者，当（R=0）时，他可以选择任何顶点。"
date: "2026-08-08T10:29:39+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102458
codeforces_index: "B"
codeforces_contest_name: "Hanoi final contest"
rating: 0
weight: 102458
solve_time_s: 138
verified: true
draft: false
---

[CF 102458B - 丹尼尔和游戏秀](https://codeforces.com/problemset/problem/102458/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该图是一棵树，因为它有 (n) 个顶点，并且在连接时恰好有 (n-1) 个边。 每条边都有一个韧性 (a)，这意味着 Daniel 在他的回合中最多可以跨越该边 (a) 次。 他选择一个起始顶点（R），或者，当（R=0）时，他可以选择任何顶点。 他可以随时停下来，他的得分就是他越过边缘的次数。 

关键的困难在于，树中的边缘只有一种方式进入其远端，也只有一种方式返回。 如果丹尼尔在他进入的同一侧完成，则该边缘必须被跨越偶数次。 如果丹尼尔在另一边完成，则必须跨越奇数次。 因此，问题在于选择步行的结束位置，同时最大化每个探索的子树中的可用交叉数量。 

官方给出的约束允许(n)最大为(10^5)，边缘韧性最大为(10^9)，时间限制为2秒。 这排除了 (n) 中的任何二次方。 对于每个可能的起始顶点花费 (O(n)) 工作的解决方案在最坏的情况下将执行大约 (10^{10}) 次操作。 预期的解决方案必须仅处理树恒定的次数。 

在几种边缘情况下，边缘容量的简单总和会给出错误的答案。 对于一个顶点，根本没有边：```
1
1
```答案是`0`。 假设每条边都有贡献而不处理空树的公式将立即失败。 

如果丹尼尔停在另一个端点上，则可以使用具有韧性的单边一次：```
2
1 2 1
1
```答案是`1`。 假设每个遍历的边都必须使用两次的粗心解决方案将返回零。 

韧性单边也可以充当进入大型子树的单向网关。 考虑：```
3
1 2 1
2 3 9
1
```Daniel 可以穿过 (1)-(2) 一次，然后穿过 (2)-(3) 九次，最后到达顶点 3，得分为`10`。 仅计算可进入并完全返回的子树的解决方案将错过整个第二条边。 

值 (R=0) 引入了另一个微妙之处，因为最佳起始顶点不必是实现所使用的任意根。 例如：```
3
1 2 3
1 3 3
0
```从顶点 2 开始，丹尼尔可以使用两条边 3 次，直到顶点 3 为止，得分为`6`。 从中心开始只给出`5`，因此仅在顶点 1 处将树生根并在那里获取答案是不够的。 

## 方法

 一种直接的方法是固定起始顶点并运行树 DP，该树 DP 决定是否访问每个子树并从中返回，或者最终遍历是否进入该子树。 这个 DP 是正确的，因为树上的每次行走都有一个从起点开始的唯一最终方向，并且每个其他探索过的分支都必须进入和离开相同的次数。 如果我们对每个可能的起始顶点独立重复此计算，则每次运行将花费 (O(n))，产生 (O(n^2)) 工作。 在（n=10^5）时，大约是（10^{10}）次操作，远远超出了时间限制。 

有用的观察是，相同的 DP 可以表示为两个相邻顶点之间的消息。 删除边缘 (uv)。 该树分成两个独立的部分。 从 (u) 方面来看，我们只需要两条信息：从 (u) 开始和结束的步行的最佳得分，以及从 (u) 开始并在该组件中的任何位置结束的步行的最佳得分。 

将这些值称为 (F(u\to v)) 和 (G(u\to v))。 一旦知道进入某个顶点的所有消息，就可以通过排除该邻居的贡献来获得发送给任何一个邻居的消息。 这正是 rerooting DP 的设计目的。 

对于韧性边缘 (a)，定义其最佳偶数用法和最佳奇数用法。 当 (a) 为偶数时，最佳偶数用法为 (a)；当 (a) 为奇数时，最佳偶数用法为 (a-1)。 如果(a=1)，则该值为零，并且该边缘根本不能用于闭合偏移。 当 (a) 为奇数时，最佳奇数用法为 (a)；当 (a) 为偶数时，最佳奇数用法为 (a-1)。 

假设相邻组件提供闭合值 (F)。 如果边缘用作往返，则其贡献为其最佳偶数使用加 (F)，除非最佳偶数使用为零，在这种情况下，组件无法进入和返回。 如果边缘用作通往端点的最终路径，则其贡献是其最佳奇数使用加上相邻 (G) 值。 

这会在重新生根后以线性时间给出两条消息。 第一次树遍历计算子到父的消息。 第二次遍历提供父到子的消息，并在每个顶点评估从那里开始的最佳步行。 如果 (R) 是固定的，我们就取该顶点的值。 如果 (R=0)，我们取所有顶点的最大值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n^2)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳重生 DP | (O(n)) | (O(n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 在顶点1处暂时为树设置根。该根只是一个实现装置。 它与丹尼尔所需的起始顶点无关。 
2. 对于每个有向树边 (u\to v)，将 (F(u\to v)) 定义为在 (u) 处开始和结束的闭合游走的最大分数，仅使用删除 (uv) 后包含 (u) 的分量。 将 (G(u\to v)) 定义为从 (u) 开始并在同一组件中的任意位置结束的步行的最高得分。 

这两个值就足够了，因为封闭的子游览可以附加到当前顶点处的步行，而最多一个子游览可以包含开放步行的最终端点。 
3. 对于由韧性边 (a) 连接的邻居 (w)，计算其闭合贡献

 [
 C=
 \开始{案例}
 a + F(w\to u), & a\text{ 偶数},\
 a-1 + F(w\to u), & a\text{ 奇数且 }a>1,\
 0，&a=1。 
\结束{案例}
 ]

 特殊情况（a=1）的原因是进入该组件需要一次穿越，但返回需要第二次不存在的穿越。 
4. 计算相应的开放贡献

 [
 O = \operatorname{odd}(a) + G(w\to u),
 ]

 其中 (\operatorname{odd}(a)) 是不超过 (a) 的最大奇数。

选择此贡献意味着行走最终在邻居的组件内结束，因此连接边必须穿过奇数次。 
5. 自下而上处理有根树。 对于每个顶点 (u)，将所有子节点的封闭贡献相加。 这给出 (F(u\toparent[u]))。 在孩子们中，找到 (O-C) 的最大值。 用开放式游览代替封闭式儿童游览可以得到

 F(u\toparent[u])+\max(0,\max(O-C))。 
]

 只有一个子节点可以包含最终端点，因此只能替换一个封闭的贡献。 
6. 自顶向下处理树。 在顶点 (u)，来自其父级和子级的所有传入消息现在都可用。 将他们的封闭式贡献相加，以获得从 (u) 开始和结束的最佳封闭式走走。 
7. 对于每个入射边，计算 (O-C)。 从 (u) 开始的最佳步行要么保持闭合状态，要么恰好选择一个入射边来到达其最终端点。 因此

 闭合[u]+\max(0,\max(O-C))。 
]
 8. 生成消息（u\to child）时，从总数中排除该孩子的贡献。 我们需要所有其他邻居中最好的 (O-C)，因此实现保留两个最大值。 如果最佳值来自被排除的孩子，则使用次佳值。 
9. 如果(R\neq0)，输出`answer[R]`。 如果(R=0)，输出最大值`answer[u]`在每个顶点上，因为丹尼尔可以自由选择他的起点。 

### 为什么它有效

 考虑从固定顶点开始的任何有效行走。 因为图是一棵树，所以不在从起始顶点到最终顶点的路径上的每条边都必须经过偶数次。 该路径上的每条边都必须经过奇数次。 对于偏离路径的边缘，最佳可能的选择正是封闭贡献 (C)。 对于路径边，最好的选择正是开放贡献（O）。 在每个顶点，只有一个入射方向可以包含最终端点，因此 DP 最多需要用开放贡献替换一个封闭贡献。 值 (F) 和 (G) 精确地捕获了每个有向分量内的这两种可能性。 重新根化使得每个可能的起始顶点都可以使用相同的语句，因此`answer[u]`对于该开始是最佳的，并且当 (R=0) 时取最大值是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    graph = [[] for _ in range(n)]

    for _ in range(n - 1):
        u, v, a = map(int, input().split())
        u -= 1
        v -= 1
        graph[u].append((v, a))
        graph[v].append((u, a))

    R = int(input()) - 1

    # Root the tree at vertex 0.
    parent = [-1] * n
    parent_w = [0] * n
    order = [0]
    parent[0] = -2

    for v in order:
        for to, w in graph[v]:
            if to == parent[v]:
                continue
            parent[to] = v
            parent_w[to] = w
            order.append(to)

    # down_f[v] = F(v -> parent[v])
    # down_g[v] = G(v -> parent[v])
    down_f = [0] * n
    down_g = [0] * n

    for v in reversed(order):
        total = 0
        best_delta = 0

        for to, w in graph[v]:
            if parent[to] != v:
                continue

            even = w - (w & 1)

            if even == 0:
                closed = 0
            else:
                closed = even + down_f[to]

            odd = w if (w & 1) else w - 1
            opened = odd + down_g[to]

            total += closed
            delta = opened - closed
            if delta > best_delta:
                best_delta = delta

        down_f[v] = total
        down_g[v] = total + best_delta

    # up_f[v] = F(parent[v] -> v)
    # up_g[v] = G(parent[v] -> v)
    up_f = [0] * n
    up_g = [0] * n

    answer = [0] * n

    for v in order:
        total = 0

        # Store the two largest O - C values.
        best1 = 0
        best2 = 0
        best_source = -1

        for to, w in graph[v]:
            if to == parent[v]:
                even = w - (w & 1)

                if even == 0:
                    closed = 0
                else:
                    closed = even + up_f[v]

                odd = w if (w & 1) else w - 1
                opened = odd + up_g[v]
            else:
                even = w - (w & 1)

                if even == 0:
                    closed = 0
                else:
                    closed = even + down_f[to]

                odd = w if (w & 1) else w - 1
                opened = odd + down_g[to]

            total += closed
            delta = opened - closed

            if delta > best1:
                best2 = best1
                best1 = delta
                best_source = to
            elif delta > best2:
                best2 = delta

        answer[v] = total + best1

        # Build messages from v to each child.
        for to, w in graph[v]:
            if parent[to] != v:
                continue

            even = w - (w & 1)

            if even == 0:
                child_closed = 0
            else:
                child_closed = even + down_f[to]

            out_f = total - child_closed

            if best_source == to:
                best_delta = best2
            else:
                best_delta = best1

            out_g = out_f + best_delta

            up_f[to] = out_f
            up_g[to] = out_g

    if R == -1:
        print(max(answer))
    else:
        print(answer[R])

if __name__ == "__main__":
    solve()
```邻接表存储两个方向上的每个树边。 临时根是顶点 1，并且`parent`与...一起`order`给出迭代 DFS 顺序. 迭代而不是递归 DFS 避免了包含 (10^5) 个顶点的路径上的 Python 递归深度问题。 

第一次反向遍历计算`down_f`和`down_g`。 对于子边缘，`closed`表示将子子树作为一个往返，而`opened`表示使最终端点位于该子树内。 他们的差异准确地告诉我们选择那个孩子作为最终方向可以获得多少收益。 

第二次遍历计算相反的定向消息。 在每个顶点，`total`包含来自每个入射方向的所有闭合偏移。 最大的两个`delta = opened - closed`值被保留，因为在构造针对一个子项的消息时，必须排除该子项。 保留两个最大值可以避免单独扫描所有其他邻居，从而保留线性复杂性。 

所有分数都可以超过 32 位整数范围。 事实上，可以有（10^5-1）条边，并且每个韧度可以接近（10^9），所以Python的任意精度整数在这里很方便。 奇偶校验计算使用`w & 1`， 和`w - (w & 1)`给出不超过的最大偶数值`w`。 

表达式`answer[v] = total + best1`当`best1`为零。 这对应于在当前顶点结束而不是进入另一个组件。 这可以处理叶子和每个可能的开放方向都会使分数变差的情况。 

## 工作示例

 ### 示例 1

 该树是以顶点 1 为中心的星形树，具有边缘韧性 (3,4,3,4)。 Daniel 可能会选择他的起始顶点，因为 (R=0)。 

对于中心来说，每个分支都可以作为一个封闭的游览。 当 Daniel 回来时，韧性为 3 的边缘贡献 2，而韧性为 4 的边缘贡献 4。因此中心的闭合值为（2+4+2+4=12）。 选择韧性 3 分支作为最终方向，其贡献从 2 变为 3，得分增加 1。 

| 顶点| 闭合值| 最佳（O-C）| 最佳起步成绩|
 | ---| ---| ---| ---|
 | 1 | 12 | 12 1 | 13 |
 | 2 | 12 | 12 2 | 14 | 14
 | 3 | 12 | 12 0 | 12 | 12
 | 4 | 12 | 12 2 | 14 | 14
 | 5 | 12 | 12 0 | 12 | 12

 最大值为 14。一次最佳行走从顶点 2 开始，穿过边缘 (2-1) 3 次，并使用剩余的分支作为闭合偏移。 即使实现最初将树植根于顶点 1，重生计算也发现了这种可能性。官方示例给出了输出`14`。 

### 示例 2

 这里的树是一条具有韧性的路径 (2,1,2,1)，丹尼尔必须从顶点 1 开始。 

韧性 2 边的闭合贡献为 2。韧性 1 边对闭合偏移的贡献为零，因为它不能被交叉两次。 从顶点 1 开始，第一条边可以相交两次，得到两个点。 丹尼尔可以一次越过韧性-1边缘并停止，增加一分。 或者，在到达顶点 3 后，他可以在适当的方向上使用韧性 2 边缘，达到同样的最佳值 4。 

| 边缘| 韧性| 最佳均匀使用| 最佳奇数用法 |
 | ---| ---| ---| ---|
 | 1-2 | 1-2 2 | 2 | 1 |
 | 2-3 | 2-3 1 | 0 | 1 |
 | 3-4 | 3-4 2 | 2 | 1 |
 | 4-5 | 1 | 0 | 1 |

 对于顶点 1 处的固定起点，DP 获得`answer[1] = 4`。 官方示例输出是`4`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n)) | (O(n)) | 树被遍历固定次数，并且每个邻接条目被处理固定次数。 |
 | 空间| (O(n)) | (O(n)) | 邻接表以及父数组、DP、消息和答案数组都需要线性空间。 |

 对于 (n\le10^5)，线性处理意味着只需几百万次邻接操作，这适合 2 秒的限制。 内存使用量也是线性的，并且完全低于问题指定的 512 MB 限制。 

## 测试用例

 以下测试工具使用与提交的解决方案相同的重新生根实现，并检查官方示例以及针对奇偶性、韧性一、自由起始位置和最大允许树大小的案例。```python
import sys
import io

def solve_data(data: str) -> str:
    it = iter(data.split())
    n = int(next(it))

    graph = [[] for _ in range(n)]

    for _ in range(n - 1):
        u = int(next(it)) - 1
        v = int(next(it)) - 1
        w = int(next(it))
        graph[u].append((v, w))
        graph[v].append((u, w))

    R = int(next(it)) - 1

    parent = [-1] * n
    parent_w = [0] * n
    order = [0]
    parent[0] = -2

    for v in order:
        for to, w in graph[v]:
            if to == parent[v]:
                continue
            parent[to] = v
            parent_w[to] = w
            order.append(to)

    down_f = [0] * n
    down_g = [0] * n

    for v in reversed(order):
        total = 0
        best = 0

        for to, w in graph[v]:
            if parent[to] != v:
                continue

            even = w - (w & 1)
            closed = 0 if even == 0 else even + down_f[to]

            odd = w if (w & 1) else w - 1
            opened = odd + down_g[to]

            total += closed
            best = max(best, opened - closed)

        down_f[v] = total
        down_g[v] = total + best

    up_f = [0] * n
    up_g = [0] * n
    ans = [0] * n

    for v in order:
        total = 0
        best1 = 0
        best2 = 0
        source = -1

        for to, w in graph[v]:
            if to == parent[v]:
                even = w - (w & 1)
                closed = 0 if even == 0 else even + up_f[v]

                odd = w if (w & 1) else w - 1
                opened = odd + up_g[v]
            else:
                even = w - (w & 1)
                closed = 0 if even == 0 else even + down_f[to]

                odd = w if (w & 1) else w - 1
                opened = odd + down_g[to]

            total += closed
            delta = opened - closed

            if delta > best1:
                best2 = best1
                best1 = delta
                source = to
            elif delta > best2:
                best2 = delta

        ans[v] = total + best1

        for to, w in graph[v]:
            if parent[to] != v:
                continue

            even = w - (w & 1)
            child_closed = 0 if even == 0 else even + down_f[to]

            out_f = total - child_closed
            best_delta = best2 if source == to else best1
            out_g = out_f + best_delta

            up_f[to] = out_f
            up_g[to] = out_g

    if R == -1:
        return str(max(ans))
    return str(ans[R])

def run(inp: str) -> str:
    return solve_data(inp).strip()

# Official samples
assert run("""5
1 2 3
1 3 4
1 4 3
1 5 4
0
""") == "14", "sample 1"

assert run("""5
1 2 2
2 3 1
3 4 2
4 5 1
1
""") == "4", "sample 2"

assert run("""7
1 2 1
1 3 1
2 4 9
2 5 9
3 6 9
3 7 9
1
""") == "18", "sample 3"

assert run("""1
1
""") == "0", "sample 4"

# Custom: a single toughness-one edge can be crossed once.
assert run("""2
1 2 1
1
""") == "1", "toughness one"

# Custom: a toughness-one gateway can lead to a large final path.
assert run("""3
1 2 1
2 3 9
1
""") == "10", "one-way gateway"

# Custom: all equal even capacities, with free choice of start.
assert run("""5
1 2 2
1 3 2
1 4 2
1 5 2
0
""") == "8", "all equal capacities"

# Maximum-size test: 100000 vertices, every edge has toughness one.
# Starting at one leaf, Daniel can go through the center to another leaf.
n = 100000
parts = [str(n)]
for v in range(2, n + 1):
    parts.append(f"1 {v} 1")
parts.append("0")
large_input = "\n".join(parts) + "\n"

assert run(large_input) == "2", "maximum n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1`|`0`| 无边的最小尺寸树 |
 |`2 / 1 2 1 / R=1`|`1`| 边缘只能使用一次的边界情况 |
 |`3 / 1-2:1, 2-3:9 / R=1`|`10`| 韧性 - 一条边通向有用的子树 |
 | 四棱星，尽显韧性`2`,`R=0`|`8`| 等容量并选择最佳起始顶点 |
 | 10万顶点星体，全韧性`1`,`R=0`|`2`| 最大值 (n)、大输入和在许多邻居上重新定位 |

 ## 边缘情况

 对于单顶点树```
1
1
```邻接表为空。 关闭和打开 DP 值均为零，因此`answer[0]`为零。 由于 (R=1)，程序打印`0`。 除了正常的 DP 之外，不需要任何特殊情况的分支。 

为了```
2
1 2 1
1
```唯一的边具有最佳偶数使用 0 和最佳奇数使用 1。 从顶点 1 开始，闭合值为 0，而通过边的开放值为 1。 DP选择开放方向，产生`1`。 这正是为什么不能简单地丢弃韧性一边缘的原因。 

为了```
3
1 2 1
2 3 9
1
```边 (1-2) 不能用作闭合偏移，因此其闭合贡献为零。 它的开放贡献是(1+G(2\to1))。 在以顶点 2 为根的组件内部，韧性为 9 的边可以用作最终边九次，即 (G(2\to1)=9)。 顶点 1 处的结果值为 (1+9=10)。 DP 抓住了这样一个事实：对于往返而言无用的边作为最终路径的一部分仍然非常有价值。 

为了```
3
1 2 3
1 3 3
0
```中心有二韧三棱。 如果步行从中心开始并在树叶处结束，则一条边可以使用 3 次，而另一条边只能使用两次，即 5 次。 如果步行从一片叶子开始并在另一片叶子结束，则两条边都在端点路径上，并且每条边都可以使用 3 次，即 6 次。 仅第一个自下而上的传递无法发现这一点，因为它的根位于顶点 1，但自上而下的重新根传递会计算从中心到每个叶子的消息。 由此产生的`answer`因为叶子是六，并且 (R=0) 选择该最大值。 

提供的第三个样本包含紧邻起始顶点下方的两条韧性一边和位于其下方的四条韧性九边。 坚韧的一条边无法支撑回程，但它可以成为最终路径的第一条边。 一旦丹尼尔穿过它，他就可以使用坚韧九刃九次并到达那里。 重新生根的DP给出了所需的分数`18`，与官方样品相符。
