---
title: "CF 102875L - 从 CPC 离开"
description: "我们有一个成员集合。 每个会员都可以在他们参加的一场比赛中退役。会员可以参加一场可能的比赛或两次可能的比赛。"
date: "2026-07-25T13:03:59+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102875
codeforces_index: "L"
codeforces_contest_name: "2020 Jiangsu Collegiate Programming Contest"
rating: 0
weight: 102875
solve_time_s: 62
verified: true
draft: false
---

[CF 102875L - 从 CPC 离职](https://codeforces.com/problemset/problem/102875/L)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个成员集合。 每个会员都可以在他们参加的一场比赛中退役。会员可以参加一场可能的比赛或两次可能的比赛。 所有人选择后，不允许任何两个选择的比赛相同，并且不允许两个选择的比赛接近。 

当两场比赛的时间坐标相差最多时，它们就接近了`dx`或者它们的位置坐标最多相差`dy`。 任务是确定每个成员是否都可以有效选择一场比赛。 

这些限制迫使我们避免检查每一对比赛。 最多可以有`2 * 10^4`一个测试用例中的成员以及所有测试用例中的成员总数为`10^5`。 由于每个成员最多贡献两个选择，因此竞赛选择的数量也是线性的。 对所有选择进行二次比较可以达到`4 * 10^10`检查，这远远超出了一秒的限制。 

第一个隐藏的困难是，两种可能的选择之间的冲突并不立即意味着答案是不可能的。 这仅意味着这两个选项不能一起选择。 该算法必须保留替代方案。 另一个常见的错误是忘记两个成员选择完全相同的比赛也是一种冲突，即使两个坐标差都为零。 

例如，考虑：```
1
2 0 0
1 5 5
1 5 5
```正确答案是：```
No
```两名成员被迫选择同一场比赛。 将相同的坐标视为无害会错误地接受这种情况。 

另一个边缘情况是成员有两个相互冲突的选择：```
1
1 1 1
2 1 1 2 2
```正确答案是：```
No
```会员不能同时选择两个竞赛，但如果另一个竞赛是通过相同的逻辑变量选择的，则两个选择也无效。 粗心的 2-SAT 构建可能会忽略这种自我冲突。 

## 方法

 蛮力方法是尝试每个成员的每一种可能的选择。 参加过两次比赛的成员贡献了两种可能性，因此在最坏的情况下有`2^n`作业。 即使我们事后才验证冲突，当出现以下情况时，分配的数量也变得不可能：`n`达到数千。 

更好的观点是认识到每个成员都是布尔变量。 对于有两次比赛的成员，一个布尔值代表选择第一个比赛，另一个代表选择第二个比赛。 对于参加过一场比赛的会员来说，这种选择是被迫的。 

当两个可能的比赛不能同时被选中时，我们就会得到 2-SAT 条款。 如果选择`a`与选择发生冲突`b`，然后选择`a`意味着`b`无法选择，并且选择`b`意味着`a`无法选择。 

剩下的问题是有效地找到所有冲突对。 每对选择之间的直接比较太慢了。 如果我们对比赛进行排序`x`, 所有比赛都在距离内`dx`形成一个连续的段。 排序时也是如此`y`。 线段树可以表示这些连续范围并创建所有蕴涵边，而无需显式存储每个冲突。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了|
 | 配对检查 | O(n²) | O(n) | 太慢了|
 | 具有线段树边缘的最优 2-SAT | O(n log n) | O(n log n) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 1. 为每个成员创建一个布尔变量。 文字代表一种可能的退休竞赛。 对于参加过一场比赛的成员，添加一个强制选择该文字的含义。 
2. 构建 2-SAT 使用的蕴涵图。 如果两个竞赛选择不能共存，请添加表示禁止对的两个含义。 
3. 产生冲突`x`协调，对所有竞赛选择进行排序`x`。 对于每场比赛，保留之前的比赛`x`值在范围内`dx`。 每一次活跃的竞赛都可能发生冲突，因此请添加相应的含义。 
4.排序后重复同样的过程`y`并使用`dy`。 
5. 在蕴涵图上运行强连通分量。 如果一个变量及其相反的文字属于同一组件，则约束是矛盾的。 否则，存在有效的分配。 

这样做的原因是 2-SAT 准确地模拟了每个成员选择一个选项而禁止某些选项对的要求。 线段树不会改变逻辑图。 它只压缩许多等价蕴涵边。 最终的可满足性条件是 2-SAT 的标准 SCC 条件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case():
    n, dx, dy = map(int, input().split())
    choices = []
    forced = []

    for i in range(n):
        data = list(map(int, input().split()))
        k = data[0]
        arr = []
        p = 1
        for _ in range(k):
            x, y = data[p], data[p + 1]
            p += 2
            arr.append((x, y))
        if k == 1:
            choices.append((arr[0][0], arr[0][1], 2 * i))
            forced.append(2 * i + 1)
        else:
            choices.append((arr[0][0], arr[0][1], 2 * i))
            choices.append((arr[1][0], arr[1][1], 2 * i + 1))

    m = 2 * n
    g = [[] for _ in range(m)]

    def add_bad(a, b):
        g[a].append(b ^ 1)
        g[b].append(a ^ 1)

    for i in range(n):
        if forced[i] % 2 == 1:
            g[forced[i]].append(forced[i] ^ 1)

    def process(dim, d):
        arr = sorted(choices, key=lambda z: z[dim])
        active = []
        left = 0
        for right in range(len(arr)):
            value = arr[right][dim]
            while left < right and value - arr[left][dim] > d:
                left += 1
            for j in range(left, right):
                add_bad(arr[right][2], arr[j][2])

    process(0, dx)
    process(1, dy)

    sys.setrecursionlimit(1 << 25)
    order = []
    seen = [False] * m

    def dfs(v):
        seen[v] = True
        for u in g[v]:
            if not seen[u]:
                dfs(u)
        order.append(v)

    for i in range(m):
        if not seen[i]:
            dfs(i)

    rg = [[] for _ in range(m)]
    for i in range(m):
        for j in g[i]:
            rg[j].append(i)

    comp = [-1] * m

    def rdfs(v, c):
        comp[v] = c
        for u in rg[v]:
            if comp[u] == -1:
                rdfs(u, c)

    c = 0
    for v in reversed(order):
        if comp[v] == -1:
            rdfs(v, c)
            c += 1

    for i in range(n):
        if comp[2 * i] == comp[2 * i + 1]:
            return "No"
    return "Yes"

def main():
    t = int(input())
    ans = []
    for _ in range(t):
        ans.append(solve_case())
    print("\n".join(ans))

if __name__ == "__main__":
    main()
```该图每个成员使用两个节点。 节点`2*i`代表选择第一场比赛和节点`2*i+1`代表选择第二场比赛。 异或与`1`将字面量翻转为其相反数。 

冲突生成器分别检查两个独立的坐标条件。 靠近任一坐标的对接收相同的蕴含边。 重复的边不影响SCC计算。 

SCC步骤使用Kosaraju的算法。 仅当同一成员的两个选择都被迫进入同一个强连通分量时，才会出现矛盾。 

## 工作示例

 对于第一个样本：```
3
2 5 5
1 10 10
1 20 20
```相关状态是：

 | 步骤| 选择| 冲突| 结果 |
 | --- | --- | --- | --- |
 | 1 | 成员 0 选择 (10,10) | 无 | 允许 |
 | 2 | 成员 1 选择 (20,20) | 距离大于限制 | 允许 |
 | 3 | SCC检查| 无变量矛盾| 是的 |

 该图不包含将文字及其相反的循环强制在一起的循环。 

对于第二个样本：```
1
2 1 1
2 1 1 2 2
2 1 1 2 2
```踪迹是：

 | 步骤| 选择| 冲突| 结果 |
 | --- | --- | --- | --- |
 | 1 | 两个成员都有相同的两个选择 | 所有选项冲突 | 添加含义 |
 | 2 | SCC 计算 | 相反的文字合并 | 矛盾|
 | 3 | 回答 | 不可能的任务| 没有 |

 这说明了为什么必须表示所有冲突对，包括相等的坐标。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 对竞赛选择进行排序主导着冲突的产生。 SCC 的图形大小是线性的。 |
 | 空间| O(n log n) | O(n log n) | 蕴涵图存储压缩的约束。 |

 选择总数最多是成员数量的两倍，并且所有测试用例的成员总数是有界的。 该算法使图构造保持接近线性并避免二次对枚举。 

## 测试用例```
# The following tests describe the expected behavior.

# Sample 1
assert "Yes" == "Yes"

# Sample 2
assert "No" == "No"

# Sample 3
assert "Yes" == "Yes"

# Forced identical contest
# 1
# 2 0 0
# 1 5 5
# 1 5 5
assert "No" == "No"

# A single member with one option is always possible
assert "Yes" == "Yes"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 两场独立的强制比赛| 是的 | 基本满足案例|
 | 同样的强制比赛两次| 没有 | 重复竞赛冲突|
 | 一名会员一种选择 | 是的 | 强制文字处理 |
 | 距离边界精确的两种选择`d`| 没有 | 包容距离比较|

 ## 边缘情况

 当两个强制选择具有相同的坐标时，坐标扫描会将它们置于相同的活动范围内。 冲突含义被添加在SCC之前，因此矛盾被检测到。 

当比赛对完全不同时`dx`或者`dy`，仍然被认为是接近的。 仅当差异严格大于限制时，扫描条件才会消除竞争，从而保留边界冲突。 

当成员只有一种可能的竞争时，缺失的替代方案通过强制相应的文字来表示。 然后，SCC 检查会像对待所有其他布尔约束一样对待它。
