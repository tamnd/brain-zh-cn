---
title: "CF 1648C - 泰勒和弦乐"
description: "我们有两个整数序列 s 和 t，代表两个字符串的字母。 每个整数对应一个不同的字母，并且 s 和 t 中相同的整数表示相同的字符。"
date: "2026-06-10T03:58:28+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "data-structures", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1648
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 775 (Div. 1, based on Moscow Open Olympiad in Informatics)"
rating: 1900
weight: 1648
solve_time_s: 57
verified: true
draft: false
---

[CF 1648C - 泰勒和弦乐](https://codeforces.com/problemset/problem/1648/C)

 **评级：** 1900
 **标签：** 组合数学、数据结构、实现
 **求解时间：** 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个整数序列，`s`和`t`，代表两个字符串的字母。 每个整数对应一个不同的字母，并且相同的整数`s`和`t`表示相同的字符。 泰勒想计算有多少种不同的重排`s`结果是一个按字典顺序小于的字符串`t`。 输出应取模`998244353`。 

词典比较的定义如常：给定两个序列，第一个不同的元素决定顺序，或者如果一个序列是另一个序列的严格前缀，则较短的序列较小。 例如，`[1,2]`小于`[1,2,3]`， 但`[2,1]`大于`[1,2]`。 

约束条件允许`n`和`m`最多 200,000。 计算所有排列`s`显然是不可行的，因为阶乘增长是极端的。 即使存储所有排列也是不可能的。 因此，我们需要一种无需显式生成排列即可对排列进行计数的方法。 

出现了一些棘手的情况。 如果`s`包含重复元素，对不同排列的简单计数可能会计数过多。 如果`n < m`，一些排列`s`可能更小只是因为它们比`t`但共享一个前缀。 另外，如果`n > m`，仅排列与第一个不同的排列`m`元素 和 在这一点上较小的元素是相关的； 否则，它们会自动变大。 

例如，如果`s = [1,1,2]`和`t = [1,2,1,2]`，排列`[1,1,2]`和`[1,2,1]`小于`t`， 但`[2,1,1]`更大。 一种粗心的方法，假设所有排列`s`短于`t`更小就会多算。 

## 方法

 蛮力方法是生成所有不同的排列`s`并计算那些按字典顺序小于的`t`。 此方法适用于正确性，但会立即失败`n > 10`，因为排列数是`n!`并且可以轻松超过`10^12`。 因此，对于给定的约束是不切实际的。 

更快解决方案的关键见解是，可以通过比较第一个元素，然后比较第二个元素，依此类推，逐步确定字典顺序。 如果我们知道有多少排列以某个数字开头，我们就可以计算所有小于的排列`t`而不生成它们。 这将问题简化为计算具有多集约束的排列。 使用阶乘和模逆，我们可以有效地计算每个前缀的排列数量。 芬威克树（二叉索引树）有助于快速求和小于当前元素的计数`t_i`在`O(log n)`时间。 

因此，我们不是生成排列，而是计算有多少个序列以每个可能的前缀小于`t`。 当前缀等于开头时`t`，我们继续检查下一个字符。 下面第一个不匹配`t`允许使用阶乘除法计算所有剩余排列以考虑重复元素。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!) | O(n!) | 太慢了 |
 | 最佳 | O(n log n + 最大元素) | O(最大元素 + n) | 已接受 |

 ## 算法演练

 1. 预先计算阶乘和模逆`max(n, max(s))`用于排列计数。 这使我们能够计算模多项式系数`998244353`。 
2. 计算每个整数出现的次数`s`并将它们存储在数组或字典中`freq`。 这代表字母的多集。 
3. 在可能的整数范围内初始化 Fenwick 树。 插入所有元素的频率`s`。 这使我们能够快速查询有多少元素小于给定的整数。 
4. 将剩余的排列总数初始化为多项式系数`s`,`total_perms = n! / (product of freq[i]!)`。 这包括了所有不同的安排`s`。 
5. 迭代`t`按索引`i`:

 a. 为了`t_i`，查询 Fenwick 树中小于的元素计数总和`t_i`。 将此总和乘以剩余的排列数`n-i`元素（更新阶乘以删除使用的元素），并添加到答案中。 

b. 如果`freq[t_i] == 0`，停止迭代，因为没有排列可以继续匹配`t`。 

c. 否则，减少`freq[t_i]`乘以一，更新芬威克树，并更新`total_perms`相应地考虑所使用的一种元素。 
6. 如果迭代完成且没有停止`n < m`，给答案加 1，因为`s`本身是一个前缀`t`因此更小。 
7. 输出答案模数`998244353`。 

**为什么有效：** 在每一步，算法都会计算所有偏离的序列`t`以更小的方式在该位置处，使用多项系数来解释重复元素。 芬威克树允许查询存在多少个小于当前的选择`t_i`。 不变的是，每一步计算的排列数量恰好是从到目前为止考虑的前缀开始的字典顺序较小的序列的数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def modinv(x):
    return pow(x, MOD - 2, MOD)

def solve():
    n, m = map(int, input().split())
    s = list(map(int, input().split()))
    t = list(map(int, input().split()))

    max_val = max(max(s, default=0), max(t, default=0)) + 2

    # Precompute factorials and inverses
    fact = [1] * (n + 2)
    invfact = [1] * (n + 2)
    for i in range(1, n + 2):
        fact[i] = fact[i - 1] * i % MOD
    invfact[n + 1] = modinv(fact[n + 1])
    for i in range(n + 1, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD

    # Frequency count
    freq = [0] * max_val
    for num in s:
        freq[num] += 1

    class Fenwick:
        def __init__(self, size):
            self.n = size
            self.tree = [0] * (size + 2)
        def add(self, i, v):
            while i <= self.n:
                self.tree[i] += v
                i += i & -i
        def sum(self, i):
            res = 0
            while i > 0:
                res += self.tree[i]
                i -= i & -i
            return res

    ft = Fenwick(max_val)
    for i in range(1, max_val):
        if freq[i]:
            ft.add(i, freq[i])

    total_perms = fact[n]
    for i in range(1, max_val):
        total_perms = total_perms * invfact[freq[i]] % MOD

    ans = 0
    rem = n
    for i in range(min(n, m)):
        x = t[i]
        smaller = ft.sum(x - 1)
        if smaller > 0:
            temp = total_perms * smaller % MOD
            temp = temp * modinv(rem) % MOD
            ans = (ans + temp) % MOD
        if freq[x] == 0:
            break
        total_perms = total_perms * freq[x] % MOD
        total_perms = total_perms * modinv(rem) % MOD
        freq[x] -= 1
        ft.add(x, -1)
        rem -= 1
    else:
        if n < m:
            ans = (ans + 1) % MOD

    print(ans)

solve()
```该解决方案首先设置阶乘和模逆来计算多项系数。 频率通过 Fenwick 树存储和管理，以允许对较小元素进行快速求和查询。 这`total_perms`变量跟踪使用元素时剩余的排列数量。 每次迭代经过`t`计算以小于的前缀开头的排列`t`并相应地调整剩余的排列。 边界条件，例如`n < m`或缺少元素`s`，明确处理。 

## 工作示例

 **样品1：**

 输入：```
3 4
1 2 2
2 1 2 1
```| 我| t[i] | t[i] | 较小| 频率 | 总权限 | 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 2 | 1 | [1,2,2]| 3 | 1 |
 | 1 | 1 | 1 | [1,1,2]| 1 | 2 |

 迭代在 2 个元素后停止，因为下一个 t[2]=2 但剩余的频率允许排列。 由于n<m，无需进一步添加。 答案=2。 

**样本2：**

 输入：```
4 4
1 2 3 4
4 3 2 1
```| 我| t[i] | t[i] | 较小| 频率| 总权限 | 和 |
 | --- | --- | --- | --- | --- | --- |
