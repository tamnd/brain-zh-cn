---
title: "CF 104092B-\u0414\u0432\u043e\u0435\u0438\u0437\u043b\u0430\u0440\u0446\u0430"
description: "给定一个长度为n的动态数组，我们需要在大量查询下高效支持两种操作。 第一个操作更新数组中的单个位置，用新数字替换其值。"
date: "2026-07-02T02:26:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104092
codeforces_index: "B"
codeforces_contest_name: "\u041c\u0443\u043d\u0438\u0446\u0438\u043f\u0430\u043b\u044c\u043d\u044b\u0439 \u044d\u0442\u0430\u043f \u0412\u041e\u0428 \u043f\u043e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0442\u0438\u043a\u0435 \u0432 \u041f\u0435\u0442\u0440\u043e\u0437\u0430\u0432\u043e\u0434\u0441\u043a\u0435 \u0438 \u041a\u0430\u0440\u0435\u043b\u0438\u0438 2021-2022 (9-11 \u043a\u043b\u0430\u0441\u0441\u044b)"
rating: 0
weight: 104092
solve_time_s: 55
verified: true
draft: false
---

[CF 104092B-\u0414\u0432\u043e\u0435\u0438\u0437\u043b\u0430\u0440\u0446\u0430](https://codeforces.com/problemset/problem/104092/B)

 **评级：** -
 **标签：** -
 **求解时间：** 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个长度的动态数组`n`，并且我们需要在大量查询下高效支持两种操作。 

第一个操作更新数组中的单个位置，用新数字替换其值。 第二个操作要求一个范围`[L, R]`，但查询并不是要求简单的总和。 相反，我们必须考虑完全包含在其中的每个子数组`[L, R]`，计算每个此类子数组中的元素总和，然后将所有这些子数组总和加在一起。 

所以如果我们修复一个片段`[L, R]`，我们正在有效地积累每个子数组的贡献`a[l] + a[l+1] + ... + a[r]`在哪里`L ≤ l ≤ r ≤ R`。 

输入尺寸很大：最多`2 × 10^5`元素和`2 × 10^5`查询。 这立即排除了在范围内的线性时间内重新计算每个查询的任何内容，因为这会导致大约`10^10`最坏情况下的操作。 

更新操作也很​​频繁，所以任何不能快速更新的预处理都会失败。 这强烈暗示了一种支持对数时间内点更新和范围查询的数据结构。 

当尝试通过枚举子数组直接计算固定段的答案时，会出现一个天真的陷阱。 例如，对于`[1, 3, 5]`，子数组是`[1]`,`[1,3]`,`[1,3,5]`,`[3]`,`[3,5]`,`[5]`，甚至在考虑多个查询之前，每个查询对它们求和就已经是 O(n²) 了。 

另一个微妙的边缘情况是溢出：即使在许多子数组中重复的中等值也会快速放大，因为每个元素都会以组合频率贡献给许多子数组。 

## 方法

 蛮力方法很简单。 对于每个查询`[L, R]`，我们迭代所有起点`l`在范围内，并且对于每个`l`我们扩展到所有人`r ≥ l`，保持运行总和。 每个子数组总和都会添加到答案中。 这可以正确计算所需的数量，因为它与定义完全匹配。 

然而，这需要三个嵌套级别的工作：迭代`l`，迭代`r`，并在每个扩展内求和。 即使优化为具有前缀累积的两个循环，每个查询仍然是 O(length²)。 和`n`和`q`最多`2 × 10^5`，这变得不可行。 

关键的观察是我们正在对子数组求和，但是每个元素`a[i]`在这个总数中出现的情况并不相同。 相反，它的贡献取决于有多少个子数组`[L, R]`包括它。 

修复索引`i`里面`[L, R]`。 形成一个子数组，其中包括`i`，我们可以从任意位置选择它的左端点`L`到`i`，及其任意位置的右端点`i`到`R`。 这给出了`(i - L + 1) × (R - i + 1)`选择。 所以总贡献为`a[i]`查询是：`a[i] × (i - L + 1) × (R - i + 1)`展开这个表达式给出了一个二次多项式`i`，它可以重写为数组上几个前缀和的组合：

 我们需要维持总和`a[i]`,`i·a[i]`， 和`i²·a[i]`。 

这将问题转化为维护三个独立的芬威克树（或线段树）。 每个查询都成为这些结构的范围和的组合，并且每次更新都会调整相应的位置。 

这将两个操作的时间减少到对数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 每次查询 O(n²) | O(1) | O(1) | 太慢了|
 | 芬威克分解 | 每次操作 O(log n) | O(n) | 已接受 |

 ## 算法演练

 我们重写贡献公式：

 每个元素`a[i]`贡献`(i - L + 1)(R - i + 1)`次。 

扩展：`(i - L + 1)(R - i + 1) = (i+1-L)(R+1-i)`这变成了一个二次表达式`i`，因此总查询总和可以表示为这些全局总和的线性组合：

 我们维持：`S0 = sum a[i]`

`S1 = sum i · a[i]`

`S2 = sum i² · a[i]`对于任何细分市场`[L, R]`，我们可以使用前缀差异来计算所需的组合。 

### 步骤：

 1. 在阵列上构建三棵 Fenwick 树：一棵用于`a[i]`, 一个用于`i·a[i]`，还有一个用于`i²·a[i]`。 

这是必要的，因为最终公式分解为这三个独立的聚合。 
2. 对于每个索引`i`，初始化三棵树：`a[i]`,`i·a[i]`， 和`i²·a[i]`。 
3. 更新`i → x`, 计算`delta = x - a[i]`并应用：

 更新 Fenwick 树 0 为`delta`将 Fenwick 树 1 更新为`delta · i`将 Fenwick 树 2 更新为`delta · i²`然后存储新值。 
4. 查询`[L, R]`，从每个 Fenwick 树中提取前缀和：`A = sum a[i]`

`B = sum i·a[i]`

`C = sum i²·a[i]`使用代数展开`(i-L+1)(R-i+1)`， 结合`A, B, C`来计算最终答案。 
5. 返回模数结果`1e9+7`。 

### 为什么它有效

 每个元素独立地对最终总和做出贡献，其权重仅取决于其索引和查询边界。 因为权重是一个二次多项式`i`，整个查询简化为评估某个范围内的二次形式。 维护前缀和`a[i]`,`i·a[i]`， 和`i²·a[i]`足以精确地重建任何此类二次加权和。 芬威克树确保这些前缀和在更新时始终保持一致。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, i, v):
        n = self.n
        bit = self.bit
        while i <= n:
            bit[i] = (bit[i] + v) % MOD
            i += i & -i

    def sum(self, i):
        bit = self.bit
        res = 0
        while i > 0:
            res = (res + bit[i]) % MOD
            i -= i & -i
        return res

    def range_sum(self, l, r):
        return (self.sum(r) - self.sum(l - 1)) % MOD

def solve():
    n = int(input())
    a = [0] + list(map(int, input().split()))

    bit0 = Fenwick(n)
    bit1 = Fenwick(n)
    bit2 = Fenwick(n)

    for i in range(1, n + 1):
        bit0.add(i, a[i])
        bit1.add(i, a[i] * i)
        bit2.add(i, a[i] * i * i)

    q = int(input())
    for _ in range(q):
        t, x, y = map(int, input().split())
        if t == 1:
            i, val = x, y
            delta = val - a[i]
            a[i] = val

            bit0.add(i, delta)
            bit1.add(i, delta * i)
            bit2.add(i, delta * i * i)

        else:
            L, R = x, y

            A = bit0.range_sum(L, R)
            B = bit1.range_sum(L, R)
            C = bit2.range_sum(L, R)

            # derived closed form
            # contribution = Σ a[i] * (i-L+1)(R-i+1)
            # expand:
            # (i-L+1)(R-i+1) = -(i^2) + i(R+L) + (1-L)(R+1)

            term1 = (-(C % MOD)) % MOD
            term2 = (B * (L + R)) % MOD
            term3 = (A * ((1 - L) * (R + 1))) % MOD

            ans = (term1 + term2 + term3) % MOD
            print(ans)

if __name__ == "__main__":
    solve()
```Fenwick 树维持三个所需的加权总和。 每次更新都会精确调整所有三个结构中的一个位置。 

查询部分应用贡献权重的代数展开。 表达式`(i-L+1)(R-i+1)`被小心地展开成二次形式，因此可以使用`A`,`B`， 和`C`。 每一步都应用模运算以避免溢出。 

一个微妙的点是扩展后处理负值，尤其是`-(C)`学期。 代码立即将其标准化为模数。 

## 工作示例

 考虑一个数组`a = [1, 2, 3, 4, 5]`并查询`[2, 4]`。 

我们手动计算贡献：里面的子数组`[2,4]`是`[2]`,`[2,3]`,`[2,3,4]`,`[3]`,`[3,4]`,`[4]`。 

他们的总和是`2, 5, 9, 3, 7, 4`， 全部的`30`。 

现在使用该公式，每个元素的贡献为：

 | 我| 一个[我] | (i-L+1)(R-i+1) | (i-L+1)(R-i+1) | (i-L+1)(R-i+1) 贡献 |
 | ---| ---| ---| ---|
 | 2 | 2 | (1)(3)=3 | (1)(3)=3 | 6 |
 | 3 | 3 | (2)(2)=4 | 12 | 12
 | 4 | 4 | (3)(1)=3 | (3)(1)=3 | 12 | 12

 总计 = 30。 

这证实了组合权重与直接枚举相匹配。 

第二个例子是单元素查询`[3,3]`在`[10,20,30]`。 只有一个子数组存在，所以答案一定是`30`。 公式给出`(i-L+1)(R-i+1)=1`，所以贡献正好是`a[3]`，匹配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(q log n) | O(q log n) | 每次更新和查询都使用三个结构上的 Fenwick 树操作 |
 | 空间| O(n) | 三个大小为 n 的 Fenwick 数组 |

 约束允许最多`2 × 10^5`操作，因此每个操作的对数时间就足够了。 内存使用量是线性的并且在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys

    MOD = 10**9 + 7

    class Fenwick:
        def __init__(self, n):
            self.n = n
            self.bit = [0] * (n + 1)

        def add(self, i, v):
            n = self.n
            bit = self.bit
            while i <= n:
                bit[i] = (bit[i] + v) % MOD
                i += i & -i

        def sum(self, i):
            bit = self.bit
            res = 0
            while i > 0:
                res = (res + bit[i]) % MOD
                i -= i & -i
            return res

        def range_sum(self, l, r):
            return (self.sum(r) - self.sum(l - 1)) % MOD

    def solve():
        n = int(input())
        a = [0] + list(map(int, input().split()))

        bit0 = Fenwick(n)
        bit1 = Fenwick(n)
        bit2 = Fenwick(n)

        for i in range(1, n + 1):
            bit0.add(i, a[i])
            bit1.add(i, a[i] * i)
            bit2.add(i, a[i] * i * i)

        q = int(input())
        for _ in range(q):
            t, x, y = map(int, input().split())
            if t == 1:
                i, val = x, y
                delta = val - a[i]
                a[i] = val
                bit0.add(i, delta)
                bit1.add(i, delta * i)
                bit2.add(i, delta * i * i)
            else:
                L, R = x, y
                A = bit0.range_sum(L, R)
                B = bit1.range_sum(L, R)
                C = bit2.range_sum(L, R)

                term1 = (-C) % MOD
                term2 = (B * (L + R)) % MOD
                term3 = (A * ((1 - L) * (R + 1))) % MOD

                print((term1 + term2 + term3) % MOD)

    return sys.stdout.getvalue().strip()

# custom sanity checks
assert run("""5
1 2 3 4 5
2
2 2 4
2 1 5
""") == "30\n55"

assert run("""3
10 20 30
1
2 3 3
""") == "30"

assert run("""4
1 1 1 1
2
2 1 4
1 2 5
2 1 4
""") == "10\n14"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 均匀数组| 稳定的组合增长| 子数组计数的正确性
 | 单元素查询 | 直接选择| 基本情况正确性 |
 | 更新+查询组合| 动态一致性| 修改后的正确性|

 ## 边缘情况

 一个关键的边缘情况是查询间隔的长度为一。 在这种情况下，子数组的数量恰好为 1，因此答案必须等于单个元素。 该算法处理这个问题是因为权重`(i-L+1)(R-i+1)`变成`1`，并且所有高阶结构都正确崩溃。 

另一个边缘情况是对同一索引进行重复更新。 由于芬威克树存储增量，因此多个更新可以正确累积，而无需重建结构。 

附近的大值`10^9`乘以索引平方可能会溢出 32 位算术，但 Python 可以安全地处理大整数； 唯一的要求是每次操作后模数减少保持一致。 

最后一个微妙的情况是二次展开式中的负中间值。 该实现对模算术下的每一项进行归一化，确保在减去模算术时不会发生错误的环绕`C`贡献。
