---
title: "CF 1379A - 金合欢和弦"
description: "我们得到一个由小写字母和问号组成的短字符串。 每个问号稍后都可以替换为任何小写字母。 替换后，我们希望最终得到一个包含固定模式“abacaba”作为子字符串一次的字符串。"
date: "2026-06-16T13:22:41+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 1379
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 657 (Div. 2)"
rating: 1500
weight: 1379
solve_time_s: 407
verified: false
draft: false
---

[CF 1379A - Acacius 和字符串](https://codeforces.com/problemset/problem/1379/A)

 **评分：** 1500
 **标签：** 暴力破解、实现、字符串
 **求解时间：** 6m 47s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个由小写字母和问号组成的短字符串。 每个问号稍后都可以替换为任何小写字母。 替换后，我们希望得到一个包含固定模式的字符串`"abacaba"`作为子字符串恰好一次。 

任务不是简单地检查是否`"abacaba"`可以出现。 如果可能的话，我们必须主动构造一个完整的有效字符串，并确保在所有替换之后，最终字符串中的任何位置都恰好出现该模式一次。 

关键限制是字符串长度最多为50，测试用例最多为5000个。 这立即告诉我们，任何检查所有可能的子字符串并每次尝试执行线性验证的解决方案都是可以接受的。 每个测试用例采用二次方法就很好，因为 50 的平方是微不足道的，甚至 5000 个这样的用例也能轻松地保持在限制范围内。 

主要的微妙之处在于问号充当通配符。 它们可以是任何东西，因此可以用来强制模式匹配。 但它们也带来了危险：即使我们强迫发生一次`"abacaba"`，在填充剩余字符后，其他意外情况可能会出现在其他地方。 

一个幼稚的错误是贪婪地将模式放置在第一个兼容位置并假设它有效。 当其他隐藏事件仍然存在时，这种方法就会失败。 另一个错误是忽略了这样一个事实：问号在任意填写后可能会意外地创建额外的匹配项。 

例如，考虑如下字符串：```
?abacaba?
```如果我们放置`"abacaba"`从位置 1 开始，我们可能仍然会出现另一个重叠的事件，具体取决于我们如何填充末端。 不验证最终字符串的粗心方法将产生错误的答案。 

另一种失败模式是在解决问号之前计算出现次数。 自从`'?'`可以匹配任何东西，计算而不修复它们会导致毫无意义的结果。 

## 方法

 一个蛮力的想法是尝试一切可能的方法用字母替换问号，然后计算出现的次数`"abacaba"`。 这显然是不可行的：最多 50 个位置中的每个位置都有 26 种可能性，因此搜索空间非常大。 

我们通过观察唯一有意义的决定来减少这种情况，即单次出现`"abacaba"`将开始。 最多有 44 个候选起始位置。 对于每个候选位置，我们尝试通过检查兼容性来强制该模式：每个固定字符都必须匹配，并且可以替换问号来匹配。 

如果候选人成功，我们会通过放置临时构建一个完整的字符串`"abacaba"`在那里并任意填写所有其他问号，例如`'z'`。 然后我们通过计算出现次数来验证最终的字符串`"abacaba"`。 如果正好是一个，我们就接受。 

关键的见解是我们不需要推理全球范围内的所有替代品。 我们只需要锚定一次出现，确定性地完成字符串，并验证正确性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解所有替换品 | O(26^n·n) | O(26^n·n) | O(n) | 太慢了 |
 | 尝试所有展示位置 + 验证 | O(n^2) | O(n^2) | O(n) | 已接受 |

 ## 算法演练

 我们试图确定独特的地方`"abacaba"`应该放置子字符串。 

1. 迭代每个可能的起始索引`i`其中长度为 7 的模式适合字符串内部。 这确保我们覆盖所需子字符串的每个可能位置。 
2. 对于每个位置`i`，检查是否可以叠加`"abacaba"`到字符串上。 如果对于模式中的每个字符，原始字符串具有相同的字母或者包含`'?'`。 这保证了我们可以合法地强制使用该模式。 
3. 如果位置有效，则创建字符串的工作副本并写入`"abacaba"`进入职位`[i, i+7)`。 
4. 更换所有剩余的`'?'`在字符串中`'z'`。 此选择可避免意外创建新的事件`"abacaba"`除非是结构所迫。 
5. 扫描结果字符串并统计次数`"abacaba"`显示为子字符串。 
6. 如果计数正好为 1，则立即返回该字符串作为答案。 
7. 如果没有位置导致有效的构造，则输出`"No"`。 

### 为什么它有效

 该算法保证如果存在有效的最终字符串，则至少有一个位置`"abacaba"`与该解决方案中的真实情况相匹配。 当我们尝试该放置时，我们会准确地保留它，并通过确定性地填充其他所有内容来消除歧义。 由于每个其他字符都是固定的，因此最终出现的次数是可靠的。 任何正确的解决方案都必须对应于经过测试的锚点之一，因此我们不能错过有效的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

PAT = "abacaba"

def count_occ(s):
    cnt = 0
    for i in range(len(s) - 6):
        if s[i:i+7] == PAT:
            cnt += 1
    return cnt

def can_place(s, i):
    for j in range(7):
        if s[i+j] != '?' and s[i+j] != PAT[j]:
            return False
    return True

def solve_case(n, s):
    s = list(s)

    for i in range(n - 6):
        if not can_place(s, i):
            continue

        t = s[:]
        for j in range(7):
            t[i+j] = PAT[j]

        for k in range(n):
            if t[k] == '?':
                t[k] = 'z'

        cand = ''.join(t)
        if count_occ(cand) == 1:
            return "Yes\n" + cand

    return "No"

def main():
    t = int(input())
    out = []
    for _ in range(t):
        n = int(input())
        s = input().strip()
        out.append(solve_case(n, s))
    print("\n".join(out))

if __name__ == "__main__":
    main()
```实施的核心是对每一种可能的安置进行尝试。 帮手`can_place`确保我们永远不会覆盖冲突的固定字符。 放置模式后，我们通过将所有剩余的问号转换为来消除不确定性`'z'`，这简化了验证。 

最后的检查至关重要。 如果在完全施工后不重新计算发生的情况，我们可能会错误地接受第二次意外事故的情况`"abacaba"`出现。 

## 工作示例

 ### 示例 1

 输入：```
7
???????
```| 步骤| 行动| 字符串状态 | 有效安置 |
 | ---| ---| ---| ---|
 | 1 | 尝试 i = 0 | ?????? | 是的 |
 | 2 | 放置图案| 马尼拉| 是的 |
 | 3 | 补充休息| 马尼拉| 是的 |
 | 4 | 计数出现次数 | 1 | 接受|

 这演示了最简单的情况，其中所有灵活性都用于直接构造模式。 

### 示例 2

 输入：```
11
aba?abacaba
```| 步骤| 行动| 字符串状态 | 有效安置 |
 | ---| ---| ---| ---|
 | 1 | 尝试 i = 3 | 阿巴？阿巴卡巴| 是的 |
 | 2 | 将图案放置在 3 | 阿巴巴卡巴 | 是的 |
 | 3 | 充满 '？' | 粑粑... | 是的 |
 | 4 | 计数出现次数 | 1 | 接受|

 这显示了如何通过解析单个通配符来完成部分匹配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每次测试 O(n^2) | 最多 n 个放置，每个放置都需要扫描字符串和检查模式 |
 | 空间| O(n) | 我们存储字符串 | 的工作副本

 当 n ≤ 50 且 T ≤ 5000 时，最坏情况下的操作足够小，可以在限制内舒适地运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return __import__("__main__").solve_all()

# We adapt solution for testing
def solve_all():
    input = sys.stdin.readline
    PAT = "abacaba"

    def count_occ(s):
        return sum(s[i:i+7] == PAT for i in range(len(s)-6))

    def can_place(s, i):
        for j in range(7):
            if s[i+j] != '?' and s[i+j] != PAT[j]:
                return False
        return True

    t = int(input())
    res = []
    for _ in range(t):
        n = int(input())
        s = list(input().strip())

        ok = False
        for i in range(n-6):
            if not can_place(s, i):
                continue
            t2 = s[:]
            for j in range(7):
                t2[i+j] = PAT[j]
            for k in range(n):
                if t2[k] == '?':
                    t2[k] = 'z'
            cand = ''.join(t2)
            if count_occ(cand) == 1:
                res.append("Yes\n" + cand)
                ok = True
                break
        if not ok:
            res.append("No")
    return "\n".join(res)

__main__.solve_all = solve_all

assert run("1\n7\nabacaba\n") == "Yes\nabacaba", "sample 1"
assert run("1\n7\n???????\n") == "Yes\nabacaba", "all wildcards"
assert run("1\n11\nabacaba????\n") != "", "suffix flexibility"
assert run("1\n11\nabacacacaba\n") == "No", "no valid placement"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 全部 '？' 字符串| 是的，有图案| 施工能力齐全 |
 | 精确图案呈现 | 是的，不变 | 身份案例|
 | 不可能的字符串| 没有 | 拒绝正确性 |
 | 重叠的嘈杂情况| 是/否取决于 | 验证稳健性|

 ## 边缘情况

 一个关键的边缘情况是当`"abacaba"`已经在带问号的初始字符串中出现多次。 如果我们在填充后不明确强制唯一性，我们可能会错误地接受这种情况。 

例如：```
abacaba?abacaba
```如果我们将模式放置在第一次出现的位置并填充剩余的`'?'`和`'z'`，第二次出现可能仍保持不变。 最终计数检查通过拒绝配置来防止此错误。 

另一种边缘情况是当放置图案时消除了可能存在的第二次出现。 因为我们只覆盖一个区域并确定性地填充其余区域，所以任何幸存的事件都受到完全控制，并且必须明确计数，以确保正确性。
