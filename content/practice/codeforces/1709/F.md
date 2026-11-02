---
title: "CF 1709F - 多组弦"
description: "将长度最多为 n 的所有二进制字符串视为深度为 n 的完整二进制 trie 的节点。 除根之外的每个节点都接收介于 0 和 k 之间的容量 cs。 长度正好为 n 的二进制字符串的多重集为每个叶子分配了一些重数。"
date: "2026-06-09T20:55:41+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "brute-force", "dp", "fft", "flows", "graphs", "math", "meet-in-the-middle", "trees"]
categories: ["algorithms"]
codeforces_contest: 1709
codeforces_index: "F"
codeforces_contest_name: "Educational Codeforces Round 132 (Rated for Div. 2)"
rating: 2500
weight: 1709
solve_time_s: 108
verified: true
draft: false
---

[CF 1709F - 字符串多重集](https://codeforces.com/problemset/problem/1709/F)

 **评分：** 2500
 **标签：** 位掩码、暴力破解、dp、fft、流、图形、数学、中间相遇、树
 **求解时间：** 1m 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 考虑最多长度的所有二进制字符串`n`作为深度的完整二元树的节点`n`。 

除根节点外的每个节点都会收到一个容量`c_s`之间`0`和`k`。 长度精确的二进制字符串的多重集`n`为每片叶子分配一些多重性。 对于任意 trie 节点`s`，其子树内的总重数不能超过`c_s`。 

对于容量的固定分配，定义美丽多重集的最大大小。 任务不是找到最大值。 相反，我们必须准确计算有多少容量分配产生了最大值`f`。 

特里树包含$$2^1+2^2+\cdots+2^n=2^{n+1}-2$$具有容量的节点。 即使是为了`n = 15`，这就是65534个变量，所以直接枚举是没有希望的。 

界限`n ≤ 15`很小，但是`k`和`f`一样大`2·10^5`。 这强烈表明，有趣的状态不是 trie 结构本身，而是每个子树可以贡献的值。 任何保留所有容量分配状态的解决方案都是不可能的，而复杂度大致为多项式的解决方案`k`和线性`n`是可行的。 

出现微妙的边缘情况时`f`超出了每一个可实现的答案。 

例如：```
n = 1
k = 1
f = 3
```每片叶子的容量最多为`1`，所以最大美丽多重集大小最多为`2`。 正确答案是`0`。 仅计算分布的解决方案`k`会错误地忽略根可以达到的值高达`2k`。 

另一个容易犯的错误是在转换过程中错误地处理了相等的情况。 

假设子树的子树可以准确贡献`j`。 然后各个容量选择`c ≥ j`产生子树值`j`。 有`k-j+1`这样的能力，不`k-j`。 缺少这种额外的可能性会改变整个分布。 

## 方法

 蛮力解释很简单。 

指定一个值介于`0`和`k`到每个 trie 节点。 对于每个作业，计算最大美丽多重集大小并检查它是否等于`f`。 

特里树包含`2^{n+1}-2`节点，所以分配的数量是$$(k+1)^{2^{n+1}-2}.$$即使是为了`n=15`和`k=1`，这是一个天文数字。 

关键的观察是子树可以用单个数字来概括。 

让`val(v)`是可以放置在以节点为根的子树中的最大字符串数`v`。 

对于一片叶子来说，$$val(v)=c_v.$$对于内部非根节点，$$val(v)=\min(c_v,\; val(l)+val(r)).$$孩子们最多可以提供`val(l)+val(r)`字符串，但节点容量可能会施加更严格的限制。 

这意味着一旦我们知道该子树的结果值，节点下方容量的精确排列就无关紧要了。 我们只需要计算有多少个赋值产生了每个可能的值。 

如果我们知道高度子树的分布`h-1`，那么组合两个孩子需要计算所有值总和为`t`。 这正是一个卷积。 

自从`k`达到`2·10^5`，朴素的二次卷积太昂贵了。 问题变成了一系列多项式卷积，可以用 NTT 加速。 

由此产生的动态规划运行时间大约为`O(n k log k)`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| 指数| 太慢了|
 | DP + NTT | O(nk log k) | O(nk log k) | O(k) | 已接受 |

 ## 算法演练

 让`dp[h][x]`表示高度为非根完全二叉子树的容量分配数量`h`其最大贡献正好等于`x`。 

高度`0`意思是一片叶子。 

### 1.初始化叶子分布

 叶子值等于其容量。 

对于每一个`0 ≤ x ≤ k`：$$dp[0][x]=1.$$### 2. 合并两个子子树

 假设我们已经知道高度的分布`h-1`。 

让$$H[t] = \sum_{a+b=t} dp[h-1][a]\cdot dp[h-1][b].$$

`H[t]`计算两个孩子贡献总价值的作业`t`。 

这是使用 NTT 计算的多项式卷积。 

### 3.申请节点容量

 对于固定的子金额`t`，父值是$$\min(c,t).$$我们需要获得每个结果值的方法数量`j`。 

如果`t=j`，那么任意容量`c≥j`作品。 有`k-j+1`选择。 

如果`t>j`，那么获得价值的唯一途径`j`正在选择`c=j`。 

因此$$dp[h][j] = (k-j+1)H[j] + \sum_{t>j} H[t].$$重写：$$dp[h][j] = (k-j)H[j] + \sum_{t\ge j} H[t].$$后缀总和为`H`允许在线性时间内进行这种转变。 

### 4. 重复直至到达深度`n-1`所有非根级别均使用先前的转换进行处理。 

### 5.处理根

 根没有能力。 

它的价值简直就是$$val(root)=val(left)+val(right).$$所以最终的答案分布只是高度的又一个卷积`n-1`与自身的分配。 

系数为`f`就是答案。 

### 为什么它有效

 对于每个子树，祖先所需的唯一信息是可以放置在该子树内的最大字符串数。 递归公式$$val(v)=\min(c_v,\; val(l)+val(r))$$shows that the internal structure below a node influences higher levels only through this single value.

 The DP counts exactly how many capacity assignments produce each possible subtree value. Convolution enumerates all pairs of child values. The capacity transition enumerates all capacities that transform a child sum into a given parent value. Since every assignment is counted once and only once at every level, the final distribution at the root is exact.

 ## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353
G = 3

def mod_pow(a, e):
    res = 1
    while e:
        if e & 1:
            res = res * a % MOD
        a = a * a % MOD
        e >>= 1
    return res

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
        wlen = mod_pow(G, (MOD - 1) // length)
        if invert:
            wlen = mod_pow(wlen, MOD - 2)

        for i in range(0, n, length):
            w = 1
            half = length >> 1
            for j in range(i, i + half):
                u = a[j]
                v = a[j + half] * w % MOD

                a[j] = (u + v) % MOD
                a[j + half] = (u - v) % MOD

                w = w * wlen % MOD

        length <<= 1

    if invert:
        inv_n = mod_pow(n, MOD - 2)
        for i in range(n):
            a[i] = a[i] * inv_n % MOD

def convolution(a, b):
    need = len(a) + len(b) - 1
    n = 1
    while n < need:
        n <<= 1

    fa = a[:] + [0] * (n - len(a))
    fb = b[:] + [0] * (n - len(b))

    ntt(fa, False)
    ntt(fb, False)

    for i in range(n):
        fa[i] = fa[i] * fb[i] % MOD

    ntt(fa, True)

    return fa[:need]

def solve():
    n, k, f = map(int, input().split())

    dp = [1] * (k + 1)

    for level in range(1, n):
        h = convolution(dp, dp)

        m = len(h)
        suf = [0] * (m + 1)
        for i in range(m - 1, -1, -1):
            suf[i] = (suf[i + 1] + h[i]) % MOD

        ndp = [0] * (k + 1)
        for j in range(k + 1):
            ndp[j] = ((k - j) * h[j] + suf[j]) % MOD

        dp = ndp

    root = convolution(dp, dp)

    if f >= len(root):
        print(0)
    else:
        print(root[f] % MOD)

solve()
```基础分布对应于叶子。 每个内部级别首先执行卷积，产生子和的分布。 之后，后缀和转换应用父容量。 

表达式```
(k - j) * h[j] + suf[j]
```实施$$(k-j)H[j]+\sum_{t\ge j}H[t].$$根被单独处理，因为它没有容量限制。 

一个容易被忽略的实现细节是最大值范围。 内部子树值永远不会超过`k`，但根是两个这样的值的总和，因此最终的分布扩展到`2k`。 这就是为什么我们必须检查`f >= len(root)`在索引之前。 

## 工作示例

 ### 示例 1

 输入```
1 42 2
```为了`n=1`，只有两片叶子。 

| 步骤| 分销|
 | --- | --- |
 | 叶值|`dp[x]=1`为了`0≤x≤42`|
 | 根卷积| 总和系数`2`等于`3`|

 产生总和的对`2`是：

 | 左| 对|
 | --- | --- |
 | 0 | 2 |
 | 1 | 1 |
 | 2 | 0 |

 正好有`3`作业。 

输出：```
3
```这个例子表明，当`n=1`，答案就是叶子容量的有序对的数量总和为`f`。 

### 示例 2

 输入```
1 1 3
```| 步骤| 结果 |
 | --- | --- |
 | 叶值|`{0,1}`|
 | 总和|`{0,1,2}`|
 | 值 3 存在吗？ | 没有 |

 最终多项式有次数`2`。 

自从`3 > 2k`，答案是：```
0
```这证明了处理超出分布支持的值的重要性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(nk log k) | O(nk log k) | 每个 trie 级别一个 NTT 卷积 |
 | 空间| O(k) | 一些大小与多项式长度成正比的数组 |

 和`n ≤ 15`和`k ≤ 2·10^5`，最大多项式大小约为`4·10^5`。 NTT 在限制范围内轻松处理此类卷积，并且仅处理少量级别。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    MOD = 998244353

    # paste solve() implementation here
    return out

# provided sample
assert run("1 42 2\n") == "3\n"

# minimum values
assert run("1 1 0\n") == "1\n"

# impossible target
assert run("1 1 3\n") == "0\n"

# all pairs summing to 1
assert run("1 5 1\n") == "2\n"

# largest achievable value for n=1
assert run("1 3 6\n") == "1\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 42 2`|`3`| 官方样品|
 |`1 1 0`|`1`| 可实现的最小答案|
 |`1 1 3`|`0`| 目标超出最大范围 |
 |`1 5 1`|`2`| 有序配对计数 |
 |`1 3 6`|`1`| 最大根值 |

 ## 边缘情况

 考虑：```
1 1 3
```每片叶子的容量最多为`1`，所以根值最多为`2`。 最终的卷积仅具有求和系数`0,1,2`。 由于索引`3`不存在，算法返回`0`。 

现在考虑：```
2 2 1
```假设子项总和恰好等于`1`。 每种容量选择`c=1`或者`c=2`产生父值`1`。 转型有助于`k-j+1 = 2`的可能性。 使用`k-j`相反，只会计算其中之一并产生不正确的分布。 后缀和公式正确包含相等情况。 

最后，考虑：```
1 3 6
```唯一的有序对总和为`6`是`(3,3)`。 索引处的根卷积系数`6`正是`1`，确认算法正确处理上边界`2k`。
