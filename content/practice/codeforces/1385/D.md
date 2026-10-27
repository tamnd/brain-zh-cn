---
title: "CF 1385D - 好琴弦"
description: "任务是将给定的字符串转换为以字母“a”为中心的非常具体的递归定义结构。"
date: "2026-06-16T14:21:24+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "brute-force", "divide-and-conquer", "dp", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1385
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 656 (Div. 3)"
rating: 1500
weight: 1385
solve_time_s: 524
verified: false
draft: false
---

[CF 1385D - 好字符串](https://codeforces.com/problemset/problem/1385/D)

 **评分：** 1500
 **标签：** 位掩码、暴力破解、分而治之、dp、实现
 **求解时间：** 8m 44s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 任务是将给定的字符串转换为以字母为中心的非常具体的递归定义的结构`'a'`。 结构不是任意的：每个字符串对于给定字符都被评估为“良好”`c`，其中字符串是单个字符，等于`c`，或者它分成长度相等的两半`n/2`恰好一半被迫成为全部`c`，而另一半本身必须满足相同的定义，但对于字母表中的下一个字符。 

因此，目标不仅仅是“使字符串统一”或“使其排序”，而是在字符串上构建二叉分解树，其中每个级别将字符约束恰好分配给一侧，并且随着我们深入，该约束会增加。 

每个操作都允许任意更改单个字符，目标是最小化我们修改的位置，以便整个结构从`'a'`。 

关键的结构事实是字符串长度始终是 2 的幂，因此每个间隔都会重复地一分为二，直到大小为 1。 

从约束角度来看，所有测试用例的总长度最多为 2e5。 这立即排除了任何针对每个测试用例重新计算二次项或显式探索所有子串的解决方案。 在没有缓存的情况下对每个节点进行简单的递归重新计算会多次重新访问相同的段并超出限制。 

当一个段已经部分满足多个有效解释时，就会出现微妙的边缘情况。 例如，一个片段的一半可能已经统一，但另一半则不然，贪婪的局部修复可能会选择错误的一侧来“首先修复”，从而导致总数非最佳。 如果不仔细分离重叠的子问题，递归深度和结构很容易重复计算编辑。 

另一个陷阱是假设我们可以贪婪地独立决定每一半。 例如，如果一半更接近成为`'c'`-uniform 但选择它会导致递归成本更高，天真的贪婪分割选择会失败。 该决策必须考虑每个节点的两种可能性。 

## 方法

 蛮力的想法是直接模拟定义。 对于每个片段和每个字符`c`，我们尝试将线段`c`-好通过递归选择左半部分或右半部分来成为全部`c`，并递归求解另一半`c+1`。 在每一步中，我们都会计算需要更改多少个字符才能将一半强制转换为常量字符串。 

这是正确的，但极其多余。 各段`[l, r]`对于每个字符`c`即使相同的子问题在不同的递归分支中重复出现，也会从头开始重新计算多次。 在最坏的情况下，这大约会导致`O(n log n * 26)`状态，但由于转换内部需要大量重新计算，它的行为更接近于没有记忆的指数递归。 

关键的见解是这个问题有一个非常清晰的分而治之的结构。 每个状态完全由两个参数决定：段`[l, r]`以及所需的字符`c`。 这仅给出`O(n log n * 26)`总体上不同的状态。 每个状态都可以在恒定时间内从它的两个子状态计算出来。 这将递归转变为基于线段树分解的经典 DP。 

在每个段，我们计算两种可能性：强制左半部分一致并在右侧递归，或者强制右半部分一致并在左侧递归。 制作半统一的成本只是计算与目标字符的不匹配，这可以预先计算或动态计算，因为每个元素都是以对数方式访问的。 

这将问题简化为完整二元分解树上的自下而上或记忆自上而下的递归。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 由于重新计算，最坏情况为 O(n log n * 2^k) | O(n log n) 递归 | 太慢了|
 | 最佳DP | O(n log n) | O(n log n) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 我们将字符串视为一个反复分成两半的片段，并且在每个级别我们决定哪一半对于当前字符来说是统一的。 

1.定义递归函数`solve(l, r, c)`返回需要进行的最小更改数`s[l:r]`一个`c`- 好片段。 人物`c`代表当前所需的字母。 
2. 如果段长度为 1，则答案很简单：是否`s[l] == c`。 如果匹配，则cost为0，否则cost为1。这是递归的基本情况。 
3. 将线段分成相等的两半`[l, mid]`和`[mid+1, r]`。 
4. 计算使左半部分完全等于的成本`c`通过计算该范围内的不匹配。 打电话给这个`cost_left_uniform`。 
5. 计算使右半部分完全等于的成本`c`，类似地产生`cost_right_uniform`。 
6. 递归计算：

 - 选项 1：左半部分是统一的`c`，右半部分是`(c+1)`-好，所以总成本是`cost_left_uniform + solve(mid+1, r, c+1)`- 选项2：右半部分是统一的`c`, 左半部分是`(c+1)`-好，所以总成本是`cost_right_uniform + solve(l, mid, c+1)`7. 返回这两个选项中的最小值。 
8. 从完整段开始运行递归`[0, n-1]`有性格`'a'`。 

关键的结构决策存在于每个级别：我们被迫选择恰好一半是常数，另一半吸收下一个字符的递归。 

### 为什么它有效

 好的字符串的定义强制执行严格的二进制分解，其中每个拆分的一侧都“固定”为该级别的单个字符。 这意味着任何有效的构造都对应于所有递归节点上左注视或右注视的唯一选择序列。 通过枚举每个节点的两种可能性并为剩余段添加最佳子结构解决方案，我们涵盖了所有有效的配置。 由于每个有效的配置都分解为更小的片段上的独立子问题，并且具有严格增加的字符要求，因此递归捕获所有可能性而不会重叠或遗漏，并采用最小值确保最优性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case():
    n = int(input().strip())
    s = input().strip()
    
    # prefix frequency per character for fast range mismatch counting
    # pref[i][c] = count of character c in s[:i]
    pref = [[0] * 26 for _ in range(n + 1)]
    
    for i in range(n):
        for c in range(26):
            pref[i + 1][c] = pref[i][c]
        pref[i + 1][ord(s[i]) - 97] += 1
    
    def count_eq(l, r, c):
        total = r - l + 1
        cnt = pref[r + 1][c] - pref[l][c]
        return total - cnt  # mismatches to make all c
    
    from functools import lru_cache
    
    @lru_cache(None)
    def dp(l, r, c):
        if l == r:
            return 0 if ord(s[l]) - 97 == c else 1
        
        mid = (l + r) // 2
        
        cost_left = count_eq(l, mid, c)
        cost_right = count_eq(mid + 1, r, c)
        
        # option 1: left fixed, right recurses
        op1 = cost_left + dp(mid + 1, r, c + 1)
        # option 2: right fixed, left recurses
        op2 = cost_right + dp(l, mid, c + 1)
        
        return min(op1, op2)
    
    return dp(0, n - 1, 0)

t = int(input())
for _ in range(t):
    print(solve_case())
```该实现直接反映了递归。 使用前缀表，以便在每个查询的恒定时间内计算任何段不匹配计数。 如果没有它，每次调用都会重新扫描该段，并将复杂性推向一个额外的对数因子。 

记忆确保每个`(l, r, c)`状态计算一次。 自从`c`范围最多只有 26 个字母，并且递归树有`O(n)`每个级别的细分，状态总数保持在可控范围内。 

一个微妙的点就是人物的处理`c + 1`。 安全是因为递归深度最多为26，并且问题保证小写字母内的可行性。 该实现依赖于整数索引`0..25`。 

## 工作示例

 ### 示例 1

 输入：```
1
2
ac
```我们计算`dp(0,1,0)`在哪里`0 = 'a'`。 

| 状态 (l, r, c) | 分裂| 成本左统一| 成本合适的制服| 选项 1 | 选项 2 | 结果 |
 | --- | --- | --- | --- | --- | --- | --- |
 | (0,1,'a') | (0,1,'a') | (0,1,'a') | (0,1,'a') [0] [1] | 0 / 1 | 0 / 1 1 / 0 | 1 / 0 0 + dp(1,1,'b') | 0 + dp(1,1,'b') | 1 + dp(0,0,'b') | 1 + dp(0,0,'b') | 1 |

 在叶层，`dp(1,1,'b') = 1`,`dp(0,0,'b') = 1`，所以两个选项的结果都是 1。答案是 1。 

这显示了即使字符串很小，递归也如何强制增加字符约束。 

### 示例 2

 输入：```
1
4
ceaa
```我们计算`dp(0,3,'a')`。 

| 状态| 决定| 说明|
 | --- | --- | --- |
 | (0,3,'a') | (0,3,'a') | (0,3,'a') | (0,3,'a') 分裂| 选择最好的一半成为“a”|
 | 左侧成本 = 3，右侧成本 = 0 | 右固定| 右边已经是“aa” |
 | 递归 (0,1,'b') | 继续 | 结构转移到下一个字符 |

 该轨迹表明，一旦一半已经接近均匀，算法自然会更喜欢修复该侧，将递归推到另一半。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 每个片段都贡献持续的工作，并通过 26 个字符进行记忆 |
 | 空间| O(n log n) | O(n log n) | 递归状态加前缀表|

 限制允许最多 2e5 个字符，因此`O(n log n)`解决方案在一定范围内。 递归深度受到二进制分割和字符级数的限制，从而防止实践中出现堆栈问题。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    def solve_case():
        n = int(input().strip())
        s = input().strip()

        pref = [[0] * 26 for _ in range(n + 1)]
        for i in range(n):
            for c in range(26):
                pref[i + 1][c] = pref[i][c]
            pref[i + 1][ord(s[i]) - 97] += 1

        from functools import lru_cache

        def count_eq(l, r, c):
            return (r - l + 1) - (pref[r + 1][c] - pref[l][c])

        @lru_cache(None)
        def dp(l, r, c):
            if l == r:
                return 0 if ord(s[l]) - 97 == c else 1
            mid = (l + r) // 2
            op1 = count_eq(l, mid, c) + dp(mid + 1, r, c + 1)
            op2 = count_eq(mid + 1, r, c) + dp(l, mid, c + 1)
            return min(op1, op2)

        return dp(0, n - 1, 0)

    t = int(input())
    out = []
    for _ in range(t):
        out.append(str(solve_case()))
    return "\n".join(out)

# provided samples
assert run("""6
8
bbdcaaaa
8
asdfghjk
8
ceaaaabb
8
bbaaddcc
1
z
2
ac
""") == """0
7
4
5
1
1"""

# custom cases
assert run("""1
1
a
""") == "0", "single correct char"

assert run("""1
1
b
""") == "1", "single mismatch"

assert run("""1
2
aa
""") == "0", "already good"

assert run("""1
4
bbbb
""") == "3", "all same non-a propagation"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单身的`a`| 0 | 基本情况正确性 |
 | 单身的`b`| 1 | 叶不匹配处理|
 |`aa`| 0 | 无操作结构|
 |`bbbb`| 3 | 递归累积变化|

 ## 边缘情况

 单字符串直接测试基本递归。 用于输入`z`，函数命中`l == r`并返回 1 因为`'z'`必须转换为`'a'`。 

像这样的统一字符串`bbbb`强制每个级别的递归决策。 算法反复分裂并决定一侧必须变成`'a'`，正确地累积成本，因为每个级别贡献的不匹配计数等于段大小的一半减去正确的字母。 

部分结构化的字符串，例如`acac`证明即使局部半部看起来不错，递归仍然会强制字符进展。 该算法评估顶部分割的两个方向，并确保全局而不是局部选择最佳边。
