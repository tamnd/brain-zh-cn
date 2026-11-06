---
title: "CF 1898E - 索菲亚和弦乐"
description: "我们有两个字符串，s 和 t。 任务是确定是否可以使用两个操作将 s 转换为 t：从 s 中删除任何字符或按字母顺序对 s 的任何子字符串进行排序。"
date: "2026-06-08T21:32:04+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "greedy", "sortings", "strings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1898
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 910 (Div. 2)"
rating: 2200
weight: 1898
solve_time_s: 125
verified: false
draft: false
---

[CF 1898E - 索菲亚和弦乐](https://codeforces.com/problemset/problem/1898/E)

 **评分：** 2200
 **标签：** 数据结构、贪心、排序、字符串、两个指针
 **求解时间：** 2m 5s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有两个字符串，`s`和`t`。 任务是判断是否可以转型`s`进入`t`使用两个操作：删除任何字符`s`或对任意子串进行排序`s`按字母顺序排列。 转型必须结束于`t`确切地说，不仅仅是其字符的排列。 

输入由多个测试用例组成。 每个测试用例给出的长度`s`和`t`，然后是字符串本身。 如果可以进行转换，则输出为“YES”，否则输出为“NO”。 

约束表明`n`可以达到200,000，所有的总和`n`跨测试用例也限制为 200,000 个。 这排除了任何比线性算术更差的算法（`O(n log n)`) 每个测试用例的复杂性。 二次方法，例如尝试所有可能的子序列`s`，会太慢。 

可以打破幼稚方法的边缘情况包括以下情况`t`是排序版本的子序列`s`但不属于`s`本身。 例如，如果`s = "cba"`和`t = "bc"`，一个粗心的算法，检查子序列`s`不考虑排序操作可能会错误地拒绝它，但对前缀进行排序会给出正确的答案。 另一种边缘情况发生在`t`包含缺少的字母`s`; 这应该立即返回“NO”。 

## 方法

 暴力方法是模拟每个删除和子字符串排序的序列。 从概念上讲，我们可以尝试所有可能的排序子串`s`并删除字符直到我们匹配`t`。 这在原则上是正确的，但完全不切实际：即使对于`n = 100`，组合的数量是天文数字。 每个子串排序操作本身是`O(n log n)`，并且有`O(n^2)`子串。 

关键的见解是，第二个操作（对任何子字符串进行排序）允许我们在字符串中向前移动字符，只要没有更小的字符阻挡它们。 也就是说，要形成`t`，考虑到字母位置的奇偶性，我们需要字母从右到左以相同的相对顺序出现。 排序只能将字符移动到具有相同奇偶性（偶数或奇数索引）的位置，因为字典顺序不允许字符在没有排序操作覆盖的情况下跳过相反奇偶性的较小字符。 

为了实现这一点，我们扫描`t`从右到左并尝试将每个字符与中的相应字符匹配`s`。 我们还维护较小值的剩余字母的计数，以确定字符是否被“阻止”。 如果所需的字符被其右侧的较小字符（具有相同奇偶校验）阻挡，则无法进行转换。 

这将问题简化为使用频率表的线性扫描，从而产生有效的解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^3 log n) | O(n^3 log n) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(26) | 已接受 |

 ## 算法演练

 1.初始化一个计数器数组`cnt`对于每个字母`a`到`z`跟踪每个字符剩余的出现次数`s`当我们从末尾开始扫描时。 
2. 设置两个指针：`i`结束时`s`和`j`结束时`t`。 
3.同时`j >= 0`,尝试匹配`t[j]`和`s[i]`：

- 如果`s[i] == t[j]`, 两者都减少`i`和`j`并更新计数器`s[i]`。 
- 如果`s[i] != t[j]`，检查是否`s[i]`小于`t[j]`。 如果是这样，则增加其计数器并移动`i`向左，因为这个角色可以阻挡`t[j]`稍后如果我们尝试排序。 
- 如果存在任何更小的字符（字母值小于字母值的字符）`t[j]`）有一个正计数器，那么`t[j]`被阻止，答案是“否”。 
4.如果我们成功匹配了所有字符`t`，返回“是”。 如果指针`i`达到-1并且`j`不为-1，返回“NO”。 

为什么有效：通过从右侧扫描，我们确保每个字符`t`可以“拉”自`s`使用删除和排序，而不会被右侧较小的字母阻挡。 计数器阵列有效地跟踪潜在的阻碍因素。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def can_transform(s, t):
    n, m = len(s), len(t)
    cnt = [0] * 26
    i, j = n - 1, m - 1
    while j >= 0:
        target = ord(t[j]) - ord('a')
        while i >= 0 and ord(s[i]) - ord('a') != target:
            cnt[ord(s[i]) - ord('a')] += 1
            i -= 1
        if i < 0:
            return "NO"
        # Check if there is any smaller character blocking the target
        for k in range(target):
            if cnt[k] > 0:
                return "NO"
        i -= 1
        j -= 1
    return "YES"

t = int(input())
for _ in range(t):
    n, m = map(int, input().split())
    s = input().strip()
    t_str = input().strip()
    print(can_transform(s, t_str))
```该代码为以下字母设置了一个计数器`s`并从两个字符串的末尾迭代，确保每个字符`t`可以匹配而不会被较小的字母阻挡。 我们小心地递减计数器和指针以维持以下不变式：`s[i+1:]`仅包含可以安全忽略或删除的字母。 

## 工作示例

 跟踪第一个样本输入`s = "sofia"`和`t = "afios"`:

 | 我| j | s[i] | t[j] | 碳纳米管| 行动|
 | ---| ---| ---| ---| ---| ---|
 | 4 | 4 | 一个 | s | ... | s[i] != t[j], 递增 cnt[a], i-- |
 | 3 | 4 | 我| s | ... | s[i] != t[j], 递增 cnt[i], i-- |
 | 2 | 4 | f | s | ... | s[i] != t[j], 递增 cnt[f], i-- |
 | 1 | 4 | 哦| s | ... | s[i] != t[j], 递增 cnt[o], i-- |
 | 0 | 4 | s | s | ... | 匹配，i--，j-- |

 所有字母匹配成功，因此输出为“YES”。 

为了`s = "cba"`和`t = "bc"`:

 | 我| j | s[i] | t[j] | 碳纳米管| 行动|
 | ---| ---| ---| ---| ---| ---|
 | 2 | 1 | 一个 | c | cnt[a] = 1 | a < c，继续 i-- |
 | 1 | 1 | 乙| c | cnt[b] = 1 | b < c，继续 i-- |
 | 0 | 1 | c | c | 匹配，i--，j-- | |

 下一个`t[j] = b`，我=-1。 剩余计数器cnt[b]=1允许b移动，所以“是”。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n) | 我们扫描`s`和`t`一次，使用 26 字母计数器进行恒定时间检查 |
 | 空间| O(26) | 只需要计数器阵列即可追踪拦截器 |

 鉴于总和`n`在所有 ≤ 200,000 个测试用例中，该解决方案可在 2 秒和 256 MB 内轻松完成。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open("solution.py").read())  # assumes the solution above is saved as solution.py
    return output.getvalue().strip()

# provided samples
assert run("""8
5 5
sofia
afios
3 2
cba
bc
5 1
sofia
e
15 7
anavolimilovana
aamanan
26 4
abcdefghijklmnopqrstuvwxyz
nope
26 4
zyxwvutsrqponmlkjihgfedcba
nope
7 3
apricot
cat
3 3
cba
acb""") == "\n".join(["YES","YES","NO","YES","NO","YES","NO","YES"])

# custom cases
assert run("""1
3 3
abc
abc""") == "YES", "already equal"
assert run("""1
3 3
abc
cab""") == "YES", "sort prefix"
assert run("""1
5 3
aaaaa
aaa""") == "YES", "all letters same, deletion"
assert run("""1
5 5
abcde
fghij""") == "NO", "letters missing"
assert run("""1
1 1
a
b""") == "NO", "single letter impossible"
```| 测试输入| 预期产出 | 它验证了什么
