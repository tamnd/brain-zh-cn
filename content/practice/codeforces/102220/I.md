---
title: "CF 102220I - 温度测量"
description: "给定已经排序的城市 A、a1、a2、...、an 的温度序列。 我们需要计算有多少个不同的序列 b1, b2, ..., bn 可以产生观测值，其中 B 的温度也不会降低，并且每天 bi <= ai。"
date: "2026-08-17T22:39:32+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102220
codeforces_index: "I"
codeforces_contest_name: "The 13th Chinese Northeast Collegiate Programming Contest"
rating: 0
weight: 102220
solve_time_s: 189
verified: true
draft: false
---

[CF 102220I - 温度调查](https://codeforces.com/problemset/problem/102220/I)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出已经排序的城市 A 的温度序列，`a1, a2, ..., an`。 我们需要计算有多少个不同的序列`b1, b2, ..., bn`可以产生观测结果，其中 B 的温度也没有降低，并且`bi <= ai`每一天。 每个温度都是一个整数`1`到`n`，并且答案需要模`998244353`。 官方限制是`n <= 2 * 10^5`，总共`n`最多超过所有测试用例`5 * 10^5`、8 秒时间限制和 512 MB 内存。 

单调性是关键的结构属性。 有效的`b`不是每个位置任意选择一个值。 一次`b_i`选择后，所有后面的值都必须至少是它，而每个位置也有不同的上限。 直接枚举已经没有希望了：即使没有上限，长度非递减序列的数量`n`超过`n`值是`C(2n-1,n)`，因此检查每个候选人大约需要`n * C(2n-1,n)`最坏情况下的操作。 一个简单的动态程序`dp[i][j]`会将其减少为`O(n^2)`， 但`n = 2 * 10^5`意思是关于`4 * 10^10`国家规定，远远超出了允许的时间限制。 总输入大小为`5 * 10^5`还排除了二次成本仅分布在测试用例中的算法。 

有几种边界情况暴露了常见的错误解释。 为了`n = 1`和`a = [1]`，唯一可能的序列是`b = [1]`，所以答案是`1`。 意外允许零或以不同方式处理第一个位置的方法可能会产生不正确的计数。 

为了`a = [1, 2, 3, 4]`，答案是`14`。 一个诱人的网格解释是只计算路径`(n, a_n)`，这给出了`5`，但是这样就失去了选择的自由`b_n`。 正确的结构会添加一个额外的行和列，以便最终的向下移动代表`b_n`; 结果计数是加泰罗尼亚数字`C_4 = 14`。 

为了`a = [4, 4, 4, 4]`, 每个有效的`b`只是一个由四个值组成的非递减序列`{1,2,3,4}`。 其计数为`C(7,4) = 35`。 将这四个位置视为独立将给出`4^4 = 256`，同时乘以本地选择，例如`4 * 3 * 2 * 1`也会给出错误的答案，因为一个位置的选择会改变后面每个位置的下限。 

重复的值也很重要。 为了`a = [2,2,3]`，可能的对`(b1,b2)`是`(1,1)`,`(1,2)`， 和`(2,2)`。 他们分别允许`3`,`2`， 和`2`选择`b3`, 给予`7`。 如果采用分而治之的方法来分割相等的值而不将整个平台处理在一起，则可能会重复计算或错过沿该平坦边界的路径。 

## 方法

 最直接的解法就是枚举每一个非减序列`b`, 检查`bi <= ai`，并计算有效的。 这是正确的，因为它确实检查了完整的候选集，但即使在检查上限之前，也有`C(2n-1,n)`非递减序列。 为了`n = 2 * 10^5`，这个数字是指数级的`n`，所以这种方法不可用。 

自然的改进就是动态规划。 让`dp[i][j]`是以结尾的有效前缀的数量`b_i = j`。 然后`dp[i][j] = dp[i-1][1] + dp[i-1][2] + ... + dp[i-1][j]`每当`j <= ai`。 前缀和使每个转换时间恒定，但仍然存在`O(n^2)`州。 由于约束是局部的，暴力破解会起作用，但当可能的温度值数量变大时，暴力破解会失败。 

解锁更快解决方案的观察结果是，这个 DP 正是一个格路径问题。 画行`i`和`ai`单元格，左对齐。 路径只能向右或向下移动。 每当路径从行移动时`i`划船`i+1`，记录发生向下移动的列。 这些记录的列形成一个非递减序列，并且该行的事实`i`仅包含`ai`细胞给出`bi <= ai`。 

代表所有`n`的值`b`,附加一个额外值`a_{n+1}=n+1`。 额外的向下移动代表原始的最终值`b_n`，路径在右下角结束。 我们可以反转行，将非递减边界变成非递增楼梯。 由此产生的问题是计算费雷尔形状区域内的单调路径。 

对于该区域的矩形部分，普通DP有递推式`F(i,j) = F(i-1,j) + F(i,j-1)`。 

如果我们知道矩形顶部和左侧边界上的值，则其底部和右侧边界上的每个值都可以表示为二项式卷积。 对于有高度的矩形`h`和宽度`w`, 顶部边界值的贡献`x_j`到底部位置`i`是`x_j * C(i-j+h-1, h-1)`,

 而左边界值的贡献`y_j`到底部位置`i`是`y_j * C(i+h-1-j, i)`。 

右边界的相应公式是对称的。 

二项式系数包含阶乘，因此每个卷积都可以转化为普通的多项式乘法。 例如，`C(i-j+h-1, h-1) = (i-j+h-1)! / ((h-1)! (i-j)!)`。 

在反转一个因子并乘以阶乘或逆阶乘序列后，整个转换变成一个多项式卷积。 由于模数`998244353`支持NTT，每个卷积成本`O(k log k)`而不是二次时间。 

边界本身是通过分而治之来处理的。 在每个递归级别，我们选择单调边界的中间高度，提取具有该高度的最大矩形，用 NTT 求解其边界转换，并对剩余的两个部分进行递归。 相等的相邻值保留在同一个矩形中，这就是正确处理平台的方法。 

在任何固定的递归深度，矩形都是不相交的，因此它们的宽度和高度之和为`O(n)`。 有`O(log n)`级别，并且每个级别执行`O(n log n)`总共工作。 由此产生的复杂度是`O(n log^2 n)`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 枚举全部`b`|`O(n C(2n-1,n))`|`O(n)`| 太慢了 |
 | 全DP |`O(n^2)`|`O(n^2)`或者`O(n)`滚动行| 太慢了 |
 | 矩形分而治之 + NTT |`O(n log^2 n)`|`O(n log n)`在稀疏边界表示​​中 | 已接受 |

 ## 算法演练

 1. 解释每个有效序列`b`作为格子路径。 创建一个网格，其`i`-第 行有`ai`细胞。 从行向下移动`i`在列`j`记录`bi = j`。 向右移动会增加列，因此记录的值不会减少。 行宽限制给出`bi <= ai`。 
2. 附加一行额外的宽度`n+1`。 最后一行让最后一个向下的步骤进行编码`b_n`，所以答案就变成了从左上角到新的右下角的路径数。 
3. 颠倒行顺序。 原来的`a`是非减的，所以逆转后它是非增的。 这使得边界成为可以分解为最大水平矩形的楼梯。 
4. 预计算阶乘和逆阶乘模`998244353`最多`2n+2`。 然后可以在恒定时间内评估矩形过渡所使用的每个二项式系数。 
5.对于有高度的矩形`h`和宽度`w`，将其顶部边界上的值存储在数组中`top`以及数组中其左边界的值`left`。 从每个边界位置到目的地的路径数是二项式系数，因为路径是由其向右和向下移动的位置决定的。 
6. 通过卷积从顶部边界计算底部边界`bottom[i] += sum(top[j] * C(i-j+h-1,h-1))`。 

左边界也对底部有贡献：`bottom[i] += sum(left[j] * C(i+h-1-j,i))`。 

第一个和是与序列的普通卷积`C(k+h-1,h-1)`。 第二个相乘后变成卷积`left[j]`经过`1/(h-1-j)!`并将另一个因子乘以阶乘。 

1. 对称计算右边界。 顶部边界通过`right[i] += sum(top[j] * C(i+w-1-j,i))`,

 左边界通过`right[i] += sum(left[j] * C(i-j+w-1,w-1))`。 

这是相同的两个卷积模式，但交换了宽度和高度。 

1.对每个足够大的卷积使用NTT。 对于短数组，Python 中的直接乘法更快，因此在小阈值以下切换到二次方法。 
2.以中间一排划分楼梯。 如果多个连续行具有相同的边界高度，请将它们视为一个最大平台。 递归求解高原上方的部分，求解高原占据的矩形，然后递归求解其下方的部分。 保持高原完整可以防止相同的边界路径被处理两次。 
3. 初始状态为左上角。 整个楼梯处理完毕后，所需的答案就是最后右下角的DP值。 

### 为什么它有效

 网格结构给出了法律之间的双射`b`序列和单调路径。 在每个矩形内，标准晶格路径递归是精确的，因此二项式公式计算的 DP 值与完整的 DP 值完全相同。`O(n^2)`表将包含。 分而治之仅改变计算边界值的顺序。 它的不变性是子矩形所需的每个值都已经存在于其顶部或左侧边界上。 由于楼梯被划分为不相交的矩形，并且矩形过渡将通过任一边界进入的每条路径恰好计数一次，因此每条合法路径都会到达最后一个拐角一次，并且不会计算非法路径。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353
G = 3
NAIVE_LIMIT = 4096

def ntt(a, invert):
    n = len(a)

    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]

    length = 2
    while length <= n:
        wlen = pow(G, (MOD - 1) // length, MOD)
        if invert:
            wlen = pow(wlen, MOD - 2, MOD)

        half = length >> 1
        for start in range(0, n, length):
            w = 1
            end = start + half
            for i in range(start, end):
                u = a[i]
                v = a[i + half] * w % MOD

                x = u + v
                if x >= MOD:
                    x -= MOD
                y = u - v
                if y < 0:
                    y += MOD

                a[i] = x
                a[i + half] = y
                w = w * wlen % MOD

        length <<= 1

    if invert:
        inv_n = pow(n, MOD - 2, MOD)
        for i in range(n):
            a[i] = a[i] * inv_n % MOD

def convolution(a, b):
    if not a or not b:
        return []

    need = len(a) + len(b) - 1

    if len(a) * len(b) <= NAIVE_LIMIT:
        c = [0] * need
        for i, x in enumerate(a):
            if x:
                for j, y in enumerate(b):
                    c[i + j] = (c[i + j] + x * y) % MOD
        return c

    size = 1
    while size < need:
        size <<= 1

    fa = a[:] + [0] * (size - len(a))
    fb = b[:] + [0] * (size - len(b))

    ntt(fa, False)
    ntt(fb, False)

    for i in range(size):
        fa[i] = fa[i] * fb[i] % MOD

    ntt(fa, True)
    return fa[:need]

def count_arrays(original):
    n = len(original)

    # Add the extra row, then reverse the staircase.
    a = [0] + original + [n + 1]
    a[1:] = reversed(a[1:])

    max_fact = 2 * n + 2
    fac = [1] * (max_fact + 1)
    invfac = [1] * (max_fact + 1)

    for i in range(1, max_fact + 1):
        fac[i] = fac[i - 1] * i % MOD

    invfac[max_fact] = pow(fac[max_fact], MOD - 2, MOD)
    for i in range(max_fact, 0, -1):
        invfac[i - 1] = invfac[i] * i % MOD

    def comb(x, y):
        if y < 0 or y > x:
            return 0
        return fac[x] * invfac[y] % MOD * invfac[x - y] % MOD

    # dp[row] stores only boundary values that are needed later.
    dp = [dict() for _ in range(n + 2)]

    def add_dp(row, col, value):
        d = dp[row]
        d[col] = (d.get(col, 0) + value) % MOD

    def rect(l, r, bot, top):
        if l == 1 and r == 1 and top == n + 1:
            for col in range(bot, top + 1):
                dp[1][col] = 1
            return

        width = r - l + 1
        height = top - bot + 1

        # Top boundary.
        upper = [
            dp[l + i].get(top + 1, 0)
            for i in range(width)
        ]

        # Left boundary.
        left = [
            dp[l - 1].get(top - i, 0)
            for i in range(height)
        ]

        bottom = [0] * width
        right = [0] * height

        # Left -> bottom.
        x = [
            left[i] * invfac[height - 1 - i] % MOD
            for i in range(height)
        ]
        y = fac[:width + height - 1]
        z = convolution(x, y)

        for i in range(width):
            bottom[i] = (
                bottom[i]
                + z[height - 1 + i] * invfac[i]
            ) % MOD

        # Top -> bottom.
        kernel = [
            comb(i + height - 1, height - 1)
            for i in range(width)
        ]
        z = convolution(upper, kernel)

        for i in range(width):
            bottom[i] = (bottom[i] + z[i]) % MOD

        # Top -> right.
        x = [
            upper[i] * invfac[width - 1 - i] % MOD
            for i in range(width)
        ]
        y = fac[:width + height - 1]
        z = convolution(x, y)

        for i in range(height):
            right[i] = (
                right[i]
                + z[width - 1 + i] * invfac[i]
            ) % MOD

        # Left -> right.
        kernel = [
            comb(i + width - 1, width - 1)
            for i in range(height)
        ]
        z = convolution(left, kernel)

        for i in range(height):
            right[i] = (right[i] + z[i]) % MOD

        for i in range(width):
            add_dp(l + i, bot, bottom[i])

        # The lower-right corner belongs to both boundaries.
        for i in range(top, bot, -1):
            add_dp(r, i, right[top - i])

    def solve_staircase(l, r, bot):
        if l > r:
            return

        mid = (l + r) >> 1

        x = mid
        while x - 1 >= l and a[x - 1] == a[mid]:
            x -= 1

        y = mid
        while y + 1 <= r and a[y + 1] == a[mid]:
            y += 1

        solve_staircase(l, x - 1, a[mid] + 1)
        rect(l, y, bot, a[mid])
        solve_staircase(y + 1, r, bot)

    solve_staircase(1, n + 1, 1)
    return dp[n + 1].get(1, 0)

def solve_data(data):
    it = iter(map(int, data.split()))
    t = next(it)
    out = []

    for _ in range(t):
        n = next(it)
        a = [next(it) for _ in range(n)]
        out.append(str(count_arrays(a)))

    return "\n".join(out)

def solve():
    data = sys.stdin.buffer.read()
    sys.stdout.write(solve_data(data))

if __name__ == "__main__":
    solve()
```阶乘初始化首先出现，因为每个矩形过渡都使用二项式系数。 最大阶乘指数最多为`2n+2`，因为矩形最多有`n+1`行和`n+1`列。 

这`convolution`例程故意有一个小的直接乘法分支。 NTT 在位反转和多次变换过程中具有固定的开销，因此直接将两个微小数组相乘会更快。 大型产品使用模数特定的原根`3`，这是有效的，因为`998244353 = 119 * 2^23 + 1`。 

矩形例程完全遵循四个边界传输。 这`height - 1 + i`和`width - 1 + i`指数是最微妙的部分。 它们来自移位卷积，以便阶乘将二项式系数转换为两个一维序列的乘积。 

这`dp`结构是稀疏的，因为完整的网格具有二次大小。 仅存储位于矩形边界上的值。 当新值属于现有边界时，`add_dp`添加它而不是覆盖它。 右下角是由底部和右侧计算生成的，因此实现在第二次插入时故意跳过它。 

Python 整数不会溢出，但每次乘法仍然会模数减少`998244353`立即地。 递归深度是对数的，因为每个楼梯区域都围绕其中间进行划分，因此正常的 Python 递归限制足以满足分而治之的目的。 

实施遵循与公认的竞赛方法相同的矩形和 NTT 策略。 原始问题及其官方限制可在 Codeforces 上找到。 

## 工作示例

 ### 示例 1

 第一个样本有`n = 4`和`a = [1,1,1,1]`。 添加额外的边界值并反转后，行宽为`[5,1,1,1,1]`。 当路径穿过四个宽度为一的行时，它无法选择其列，因此只有一条路径幸存下来。 

| 舞台| 反转行边界 | 矩形高度| 矩形宽度| 结果 |
 | --- | --- | --- | --- | --- |
 | 初始状态|`5,1,1,1,1`| 1 | 5 | 五个初始边界态有价值`1`|
 | 高原|`1,1,1,1`| 4 | 1 | 仅列`1`保持可达 |
 | 最后一个角球 |`(5,1)`| | |`dp[5][1] = 1`|

 该迹线说明了为什么必须将相等的边界值作为一个平台来处理。 原始序列中没有分支，因此算法必须准确保留一条路径。 

### 示例 2

 对于`a = [1,2,3,4]`，扩展序列为`[1,2,3,4,5]`。 生成的网格是一个楼梯，有效路径正是从左上角到右下角永不离开该楼梯的路径。 有`14`这样的路径。 

| 舞台| 网格边界| 路径数量|
 | --- | --- | --- |
 | 开始|`(1,1)`|`1`|
 | 第一个楼梯层后 | 宽度`1`|`1`|
 | 第二级之后 | 宽度`2`|`2`|
 | 三级之后| 宽度`3`|`5`|
 | 第四级之后| 宽度`4`|`14`|

 顺序`1, 2, 5, 14`是加泰罗尼亚序列的开始。 此示例还说明了为什么需要额外的行。 仅通过原始第四行计算路径将在编码由以下表示的最终自由选择之前停止`b4`。 

第三个官方样本，`a = [4,4,4,4]`, 有答案`35`，匹配从四个可能温度中选择的四个非递减值的直接星条计数。 官方样本输出是`1`,`14`， 和`35`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n log^2 n)`| 每个分而治之的级别都有总的矩形边界大小`O(n)`，并且每个边界过渡都使用 NTT 卷积 |
 | 空间|`O(n log n)`| 阶乘的使用`O(n)`，而稀疏矩形边界每个位置最多需要对数个存储层 |

 总计`n`所有测试用例最多是`5 * 10^5`，因此对数因子在有限的总输入大小中共享。 预期的 C++ 实现完全在官方的 8 秒和 512 MB 限制之内。 

## 测试用例```
# The solution is assumed to be saved as solution.py.
# It exposes solve_data(data), which returns the complete output string.

from solution import solve_data

def run(inp: str) -> str:
    return solve_data(inp).strip()

# Official samples.
assert run(
    """3
4
1 1 1 1
4
1 2 3 4
4
4 4 4 4
"""
) == "1\n14\n35", "official samples"

# Minimum size.
assert run(
    """1
1
1
"""
) == "1", "minimum-size case"

# Repeated values with a non-trivial transition.
# Valid pairs (b1,b2) are (1,1), (1,2), (2,2),
# giving 3, 2, 2 choices for b3 respectively.
assert run(
    """1
3
2 2 3
"""
) == "7", "repeated boundary values"

# Boundary case where every A value is maximal.
assert run(
    """1
4
4 4 4 4
"""
) == "35", "all values equal to n"

# Large input, all values equal to 1.
# There is exactly one possible B array.
n = 200000
large = "1\n{}\n{}\n".format(n, " ".join(["1"] * n))
assert run(large) == "1", "maximum-size all-one case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 / 1`|`1`| 最小尺寸和下边界|
 |`3 / 2 2 3`|`7`| 重复值和平台处理 |
 |`4 / 4 4 4 4`|`35`| 所有值都等于最大值 |
 |`200000 / 1 1 ... 1`|`1`| 最大限度`n`、内存处理和极端平坦边界|

 ## 边缘情况

 对于`n = 1`和`a = [1]`，扩展序列为`[1,2]`。 只有一个可能的值`b1`，即`1`。 网格只有一条有效路径，因此算法以值到达最后一个角`1`。 

为了`a = [1,2,3,4]`，扩展边界为`[1,2,3,4,5]`。 楼梯路径数为`14`。 停止在原始行的构造`n`只会算`5`路径，因为它还没有代表选择`b_n`。 额外的行通过转动来修复这个边界错误`b_n`进入最后的向下过渡。 

为了`a = [4,4,4,4]`，每个非递减四元素序列`{1,2,3,4}`是有效的。 计数是`C(4+4-1,4) = C(7,4) = 35`。 在反向网格中，边界大部分是平坦的，因此最大平台逻辑将整个重复部分作为一个矩形处理，而不是将每个相等的行视为独立的边界变化。 

为了`a = [2,2,3]`，答案是`7`。 前两个位置可以是`(1,1)`,`(1,2)`， 或者`(2,2)`。 一旦这些被固定，最终值分别为`3`,`2`， 或者`2`可能的值。 矩形过渡添加这些路径族，而不会错误地合并不同的路径，从而产生`7`。 

对于最大尺寸的情况`n = 200000`与每一个`ai = 1`， 每一个`bi`也必须等于`1`，所以答案仍然是`1`。 该算法永远不会构建完整的`200000 × 200000`DP 表。 它仅存储稀疏边界值，并使用平坦的楼梯来保持分而治之的浅层。
