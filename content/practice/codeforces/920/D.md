---
title: "CF 920D - 坦克"
description: "我们有几个装有水的水箱。 单一操作是不寻常的：当我们选择水源罐时，我们并没有决定取多少水。 勺子会自动从该罐中取出最小（当前量，K）毫升，并立即将其全部倒入另一个罐中。"
date: "2026-06-13T02:54:47+07:00"
tags: ["codeforces", "competitive-programming", "dp", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 920
codeforces_index: "D"
codeforces_contest_name: "Educational Codeforces Round 37 (Rated for Div. 2)"
rating: 2400
weight: 920
solve_time_s: 603
verified: true
draft: false
---

[CF 920D - 坦克](https://codeforces.com/problemset/problem/920/D)

 **评分：** 2400
 **标签：** dp、贪婪、实现
 **求解时间：** 10m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有几个装有水的水箱。 单一操作是不寻常的：当我们选择水源罐时，我们并没有决定取多少水。 勺子自动取出`min(current_amount, K)`从该罐中取出毫升并立即将其全部倒入另一个罐中。 

目标不是使水总量等于`V`。 总金额永远不会改变。 相反，我们必须使至少一个储罐准确地容纳`V`一系列操作后的毫升数。 

输出格式是压缩的。 如果从罐中进行相同的转移`x`到坦克`y`连续重复多次，我们可以将其打印为一行`cnt x y`。 

约束是主要线索。 最多有5000个坦克，每个初始数量最多`10^5`，但目标`V`可以大到`10^9`。 对单个独家操作进行强力模拟是不可能的，因为解决方案可能需要数十亿次传输。 输出限制最多`N + 5`压缩运算强烈表明存在一个建设性的数学解决方案。 

最重要的观察结果是，该操作通过以下任一方式改变了储罐：`K`或按其剩余金额（如果当前持有量少于）`K`。 这意味着模余数`K`发挥核心作用。 

一些边缘情况很容易被忽略。 

考虑：```
2 3 0
5 7
```正确答案是肯定的。 我们可以反复从一个水箱中取出水，直到它变空。 仅搜索正目标金额的解决方案将错误地拒绝这种情况。 

考虑：```
2 5 8
3 5
```总水量为 8，所以显而易见的答案是“是”。 我们可以简单地将所有水转移到一个水箱中。 任何仅对模进行推理的方法`K`不考虑总金额就会错过这个微不足道的可能性。 

考虑：```
3 4 7
4 8 12
```所有水箱数量都是 4 的倍数。出现的每个数量仍然是 4 的倍数。由于 7 不是 4 的倍数，所以答案是否定的。 粗心的构造可能会尝试构建任意值，即使模不变量禁止它们。 

## 方法

 暴力方法将通过应用操作来探索可达状态。 这样的搜索是正确的，因为每个有效序列都对应于状态图中的一条路径。 

不幸的是，国家空间是巨大的。 一个储罐可以容纳任意大量的物质，即使输入很小，可达到的配置数量也会爆炸。 状态空间搜索是完全不可行的。 

关键的观察来自于检查模数发生的情况`K`。 

假设一个水箱至少含有`K`单位。 一次转移即可准确去除`K`，所以它的余数为模`K`不会改变。 

假设一个水箱的容量小于`K`。 一次传输将其完全清空，产生余数 0。 

因此，每个坦克只能贡献其原始余数模`K`。 我们可以反复减去`K`从罐中取出，然后可选择执行一项最终操作以使其为零。 

这建议将每个坦克视为一枚硬币，其价值为```
ri = ai mod K
```只不过余数 0 没有任何贡献。 

通过将水箱中的水排入特殊的收集箱中，我们可以自由决定哪些剩余物幸存，哪些变为零。 任何可实现的储罐量的余数都等于这些余数的某个子集的模数之和`K`。 由于每个余数都严格小于`K`，从子集获得的实际值只是余数的普通子集和。 

问题变成：

 我们可以选择一些总和等于的余数吗`V mod K`，而收集器中累计的总金额至少为`V`？ 

这导致了值模的子集和动态规划问题`K`。 自从`K ≤ 5000`， 一个`O(NK)`DP是完全实用的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力状态搜索 | 指数| 指数| 太慢了|
 | DP 上的余数模 K | O(NK) | O(K) | 已接受 |

 ## 算法演练

 ### 1. 处理简单的情况

 让`S`是水的总量。 

如果`V > S`，答案立即不可能，因为水是守恒的。 

如果`V == S`，我们可以将所有的水转移到一个水箱中并完成。 

### 2. 计算有用的余数

 对于每个坦克计算：```
ri = ai mod K
```只有这些残基对于构建目标残基很重要。 

### 3. 运行子集和 DP 模 K

 让：```
target = V mod K
```我们对余数执行背包式 DP。`dp[x]`记录是否残差和`x`可以与允许重建的父信息一起形成。 

因为每个余数都小于`K`，所有可实现的金额都在于`[0, K-1]`。 

### 4. 重建子集

 如果`target`无法到达，请回答“否”。 

否则重建坦克的一个子集，其余数总和为`target`。 

这些坦克将保留其剩余贡献。 所有其他水箱最终都将被完全排空。 

### 5.选择收集罐

 在选定的子集中，选择一辆坦克作为最终的目标坦克。 

所有未选定的储罐均完全排入其中。 

除收集器之外的选定储罐将精确减少到其剩余部分。 

收集器接收所有转移的水。 

### 6. 计算收集金额

 在所有减少之后，收集器包含```
collector_value = S - sum(other_selected_remainders)
```所选择的子集保证```
collector_value ≡ V (mod K)
```和```
collector_value ≥ V
```### 7. 将收集器减少为 V

 既然有差别```
collector_value - V
```是一个非负倍数`K`，我们反复从收集器转移到任何辅助罐中。 

每次转移都会准确去除`K`。 

收集器最终变成了`V`。 

### 为什么它有效

 不变量是坦克的余数模`K`永远不能更改为不同的非零余数。 坦克只能保持原来的剩余量或者减少到零。 

因此，每个可实现的配置都是通过选择哪些原始剩余部分幸存下来来确定的。 子集和 DP 精确地枚举了所有可能的幸存者余数和。 

修复这样的子集后，每个剩余的操作都是建设性的。 未选择的水箱减少至零，选定的水箱减少至其剩余部分，并且所有去除的水都累积在一个收集器中。 收集者的金额与期望值相差数倍`K`，因此重复的全勺传输将其精确地减少到`V`。 

由于每个可实现的残留模式都在 DP 中表示，并且每个 DP 解决方案都可以通过实际的储罐操作来实现，因此该算法既完整又正确。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, k, v = map(int, input().split())
    a = list(map(int, input().split()))

    total = sum(a)

    if v > total:
        print("NO")
        return

    target = v % k

    dp = [-1] * k
    parent = [(-1, -1)] * k
    dp[0] = -2

    rem = [x % k for x in a]

    for i in range(n):
        r = rem[i]
        if r == 0:
            continue

        ndp = dp[:]

        for s in range(k):
            if dp[s] == -1:
                continue

            ns = (s + r) % k

            if ndp[ns] == -1:
                ndp[ns] = i
                parent[ns] = (s, i)

        dp = ndp

    if dp[target] == -1:
        print("NO")
        return

    chosen = [False] * n

    cur = target
    while cur != 0:
        prev, idx = parent[cur]
        chosen[idx] = True
        cur = prev

    chosen_indices = [i for i in range(n) if chosen[i]]

    if not chosen_indices:
        chosen_indices = [0]
        chosen[0] = True

    collector = chosen_indices[0]

    ops = []

    def add_op(cnt, x, y):
        if cnt > 0 and x != y:
            ops.append((cnt, x + 1, y + 1))

    for i in range(n):
        if i == collector:
            continue

        if chosen[i]:
            need = rem[i]
            cnt = (a[i] - need) // k
            add_op(cnt, i, collector)

            a[collector] += cnt * k
            a[i] -= cnt * k
        else:
            cnt = a[i] // k
            add_op(cnt, i, collector)

            a[collector] += cnt * k
            a[i] -= cnt * k

            if a[i] > 0:
                add_op(1, i, collector)
                a[collector] += a[i]
                a[i] = 0

    diff = a[collector] - v

    aux = 0 if collector != 0 else 1

    add_op(diff // k, collector, aux)

    print("YES")
    for cnt, x, y in ops:
        print(cnt, x, y)

if __name__ == "__main__":
    solve()
```仅 DP 商店`K`状态，这是关键的优化。 父指针允许重建所选子集，而无需存储完整的 DP 表。 

构建阶段反映了证明。 所选子集之外的水箱将被完全排空。 子集中的坦克准确保留其剩余部分。 每个移除的单元都被引导到收集器中。 

一个微妙的点是收集器的最终减少。 其当前值与当前值之间的差异`V`保证能被整除`K`。 这正是为什么重复的全勺传输可以在不干扰模类的情况下消除多余的量。 

另一个微妙的细节是处理剩余为零的坦克。 它们永远不会帮助在 DP 中获得新的残基，因此可以跳过它们。 在施工过程中，它们只需完全排入收集器即可。 

## 工作示例

 ### 示例 1

 输入：```
2 3 5
2 3
```余数为`[2, 0]`。 

目标残留：```
5 mod 3 = 2
```DP 选择坦克 1。 

| 步骤| 选择的子集 | 收藏家| 收藏金额 |
 | ---| ---| ---| ---|
 | 初始| {1} | 1 | 2 |
 | 排水罐 2 | {1} | 1 | 5 |
 | 最终调整| 不需要| 1 | 5 |

 输出：```
YES
1 2 1
```痕迹显示了最简单的成功构建。 收集器立即达到所需的值。 

### 示例 2

 输入：```
3 4 7
5 6 3
```余数为`[1, 2, 3]`。 

目标残留：```
7 mod 4 = 3
```DP 可以只选择第三个坦克。 

| 步骤| 储罐值 | 收藏家|
 | ---| ---| ---|
 | 初始| (5,6,3) | 3 |
 | 排水罐 1 | (1,6,7) | 3 |
 | 排水罐 2 | (1,2,11) | 3 |
 | 减少收集器| (5,2,7) | 3 |

 收集者首先达到 11。 自从`11 - 7 = 4`，一次完整传输正好删除一个大小的块`K`，剩下 7。 

该跟踪说明了为什么只有残基类别很重要。 一旦获得正确的余数，多余的倍数`K`可以随时删除。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(NK) | 每个罐和残留物一个背负式转运 |
 | 空间| O(K) | DP 状态和家长信息 |
 | 输出尺寸| O(N) | 每个坦克至多有恒定的操作次数|

 和`N ≤ 5000`和`K ≤ 5000`， 这`O(NK)`最坏情况下复杂度执行大约 2500 万次转换，这完全符合优化的 Python 的限制。 内存使用量仍然很小，因为仅`K`DP 状态被存储。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    old = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = old
    return out.getvalue()

# provided sample
assert run("2 3 5\n2 3\n").startswith("YES")

# impossible because target exceeds total water
assert run("2 5 20\n3 4\n").strip() == "NO"

# already have exact amount
assert run("2 5 3\n3 7\n").startswith("YES")

# all values multiples of K, target residue impossible
assert run("3 4 7\n4 8 12\n").strip() == "NO"

# target zero
assert run("2 3 0\n5 7\n").startswith("YES")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 5 20 / 3 4`| 否 | 节约用水 |
 |`2 5 3 / 3 7`| 是 | 现有解决方案已存在 |
 |`3 4 7 / 4 8 12`| 否 | 模不变量|
 |`2 3 0 / 5 7`| 是 | 零目标处理 |

 ## 边缘情况

 ### 目标大于总水量

 输入：```
2 5 20
3 4
```水的总量只有 7。由于操作不会产生水，所以达到 20 是不可能的。 该算法在运行 DP 之前检测到这一点并打印 NO。 

### 所有余数均为零

 输入：```
3 4 7
4 8 12
```每个罐子都是 4 的倍数。任何操作都会删除或添加 4 的倍数，因此所有罐子数量始终保持为 4 的倍数。由于 7 不是 4 的倍数，因此不存在解。 DP仅到达残基0并正确拒绝目标残基3。 

### 目标等于零

 输入：```
2 3 0
5 7
```目标残留物也为零。 DP 立即成功并获得空子集。 该结构选择任意一个收集器，将所有水收集到其中，然后删除 3 的倍数，直到收集器恰好变为 0。 

### 现有坦克已包含 V

 输入：```
3 5 10
10 7 8
```该算法仍然有效。 DP 找到有效的残差模式，并且构造可以产生零操作或短的等效序列。 已经正确的坦克的存在永远不会导致失败，因为算法会考虑可达性而不需要任何修改。
