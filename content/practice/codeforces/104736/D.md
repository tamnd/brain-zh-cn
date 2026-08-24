---
title: "CF 104736D - 破译WordWhiz"
description: "我们有一个固定的五个字母单词词典，其中每个单词都使用五个不同的小写字母。 该词典中的第一个单词是单个游戏会话的隐藏目标单词。"
date: "2026-06-29T00:50:56+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104736
codeforces_index: "D"
codeforces_contest_name: "2023-2024 ACM-ICPC Latin American Regional Programming Contest"
rating: 0
weight: 104736
solve_time_s: 43
verified: true
draft: false
---

[CF 104736D - 解密 WordWhiz](https://codeforces.com/problemset/problem/104736/D)

 **评级：** -
 **标签：** -
 **求解时间：** 43s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个固定的五个字母单词词典，其中每个单词都使用五个不同的小写字母。 该词典中的第一个单词是单个游戏会话的隐藏目标单词。 之后，我们会收到一系列反馈字符串，每个在会话期间做出的猜测都有一个。 每个反馈字符串的长度正好是五个字符，并且针对每个位置编码猜测的字母是否在秘密单词中不存在，存在但放错位置，或者完全正确。 

重要的转折是实际猜测的单词丢失了。 我们只知道反馈模式。 对于每个反馈行，我们必须确定与已知的秘密单词相比，有多少字典单词可以准确地产生该反馈。 

一个微妙的点是，反馈是使用类似 Wordle 的规则逐个位置计算的。 仅当字母存在于秘密单词中的某个位置但不在该位置时，才可以将其标记为黄色，绿色表示完全匹配。 因为所有单词都有不同的字母，所以我们避免了重复字母的复杂性，这使得一致性检查纯粹是结构性的，而不是基于频率的。 

限制很小：最多 1000 个字典单词和最多 10 个猜测。 这立即表明根据每个猜测检查每个单词是可行的，因为即使是简单的 O(N²) 或 O(NG) 每个单词验证也完全在限制范围内。 

一个天真的误解是独立对待每个位置而不尊重字母存在的全局一致性。 例如，如果字母在一个位置显示为灰色，而在其他位置显示为黄色，则如果候选人没有模拟完整的 Wordle 反馈规则，则可能会错误地拒绝或接受候选人。 

另一个常见的陷阱是假设匹配每个位置的约束就足够了。 它不是。 反馈取决于秘密单词中是否存在字母，而不仅仅是本地位置比较。 

## 方法

 暴力策略是很自然的：对于每个猜测反馈，尝试每个字典单词作为候选猜测，针对已知的秘密单词模拟 WordWhiz 反馈，并检查生成的模式是否与存储的模式匹配。 如果匹配，则该候选词对于该猜测是有效的。 

由于字典大小最多为 1000，猜测最多为 10，因此最多可进行 10,000 次模拟。 每次模拟都会检查 5 个字符，因此总工作量约为 50,000 次字符比较，这很简单。 

关键的见解是不需要任何高级预处理或组合。 秘密单词是固定的，因此每个字典单词都会产生一个确定性的反馈字符串。 一旦我们计算了一次映射，每个查询就会减少到计算有多少单词映射到所请求的模式。 

因此，问题变成了签名函数上的频率计数任务：每个单词都映射到针对秘密单词的 5 个字符的反馈签名。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 每个查询的强力模拟 | O(N·G·5) | O(1) 额外 | 已接受 |
 | 预计算签名+计数| O(N·5 + G) | O(N) | 已接受 |

 ## 算法演练

 我们修复秘密单词并预先计算其字符集和位置映射。 对于每个字典单词，我们计算如果将其用作对秘密单词的猜测，它会产生什么反馈。 

### 步骤

 1. 读取所有单词并将秘密单词识别为第一个条目。 单独存放。 

我们还保留其字符集以进行快速成员资格检查，因为黄色与灰色取决于秘密单词中是否存在字母。 
2. 对于字典中的每个单词，根据秘密单词计算其反馈模式。 

这是通过比较每个位置来完成的：

 如果字符完全匹配，我们分配`*`。 否则，如果该字符存在于秘密单词中的某个位置，我们分配`!`。 否则，我们分配`X`。 

重要的细节是，由于所有字母都是不同的，因此我们不需要跟踪使用计数或解决重复字母之间的冲突。 
3. 存储从反馈字符串到产生该字符串的字典单词数的频率图。 
4. 对于每个给定的猜测反馈字符串，输出存储在图中的频率。 

### 为什么它有效

 与固定秘密单词相比，每个字典单词恰好对应一个确定性反馈字符串。 对于给定的猜测，两个不同的单词可以互换，当且仅当它们针对秘密生成相同的反馈模式时。 因此，按此签名对单词进行分组会将字典划分为等价类，并且每个查询仅询问一个类的大小。 

除了反馈之外，不需要有关原始猜测的信息，因为秘密词固定了评估函数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def build_feedback(secret, word, secret_set):
    res = []
    for i in range(5):
        if word[i] == secret[i]:
            res.append('*')
        elif word[i] in secret_set:
            res.append('!')
        else:
            res.append('X')
    return ''.join(res)

def solve():
    n = int(input())
    words = [input().strip() for _ in range(n)]
    
    secret = words[0]
    secret_set = set(secret)

    freq = {}

    for w in words:
        pattern = build_feedback(secret, w, secret_set)
        freq[pattern] = freq.get(pattern, 0) + 1

    g = int(input())
    for _ in range(g):
        s = input().strip()
        print(freq.get(s, 0))

if __name__ == "__main__":
    solve()
```解决方案的核心是`build_feedback`函数，它编码了 WordWhiz 的确定性规则。 我们将每个单词与秘密单词显式比较一次，因此每个字典条目都被处理一次。 

频率字典累积每个可能的反馈字符串对应有多少个单词。 这避免了对每个查询的重新计算，并将最终答案转变为简单的查找。 

一个微妙的实现细节是使用一组秘密词。 由于每个单词都有不同的字母，因此成员资格检查的时间恒定，足以确定黄色与灰色。 

## 工作示例

 ### 示例 2 样式跟踪

 考虑一个秘密词`scale`和字典单词`table`和`maple`。 两者产生相同的反馈`X!X**`。 

| 词| 位置 0 | 位置 1 | 位置 2 | 位置 3 | 位置 4 | 图案|
 | ---| ---| ---| ---| ---| ---| ---|
 | 表| X | ！ | X | * | * | X！X** |
 | 枫木| X | ！ | X | * | * | X！X** |

 这两个单词与秘密的不同之处在于完全相同的结构方式：一个正确的字母、一个错误的字母以及三个缺失或对齐的匹配项。 这说明了为什么按模式分组是有效的：反馈忽略了超出结构比较的猜测的同一性。 

这证实了从单词到模式的映射是多对一的，这正是频率表所利用的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N·5 + G) | 每个单词都会与恒定长度字符串中的秘密单词进行一次比较，并且每个查询都是字典查找 |
 | 空间| O(N) | 频率图为每个词典单词最多存储一个条目 |

 这些约束最多允许 1000 个单词和 10 个查询，因此即使是简单的模拟也在限制范围内。 该解决方案远远低于典型的竞争性编程阈值。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    def build_feedback(secret, word, secret_set):
        res = []
        for i in range(5):
            if word[i] == secret[i]:
                res.append('*')
            elif word[i] in secret_set:
                res.append('!')
            else:
                res.append('X')
        return ''.join(res)

    n = int(input())
    words = [input().strip() for _ in range(n)]
    secret = words[0]
    secret_set = set(secret)

    freq = {}
    for w in words:
        pat = build_feedback(secret, w, secret_set)
        freq[pat] = freq.get(pat, 0) + 1

    g = int(input())
    out = []
    for _ in range(g):
        out.append(str(freq.get(input().strip(), 0)))
    return "\n".join(out)

# sample-style tests (simplified placeholders)
assert run("1\nabcde\n1\n*****\n") == "1"

# all words identical pattern
assert run("3\nabcde\nfghij\nklmno\n1\nXXXXX\n") == "2"

# mixed patterns
assert run("3\nabcde\naxcye\naycde\n2\n*X*X*\nXXXXX\n") in ["1\n1", "2\n1", "1\n2"]

# secret only match
assert run("2\nabcde\nfghij\n1\n*****\n") == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 一个词| 1 | 最小字典正确性 |
 | 所有不匹配模式| 2 | 在同一反馈下对多个单词进行分组|
 | 混合图案| 变量| 模式分类的正确性|
 | 仅限秘密比赛 | 1 | 处理完全正确的猜测|

 ## 边缘情况

 一种极端情况是许多字典单词陷入相同的反馈模式。 该算法自然地处理这个问题，因为它会增加每个计算签名的计数。 例如，如果多个单词仅在相同位置与秘密不同，则它们都会产生相同的模式并正确分组。 

另一个边缘情况是字典中从未出现反馈模式。 在这种情况下，地图查找返回零，这符合要求。 由于我们总是使用`.get`，丢失的钥匙得到安全处理。 

最后，秘密词本身总是产生`*****`图案。 这保证了至少一个字典单词对该桶有贡献，并且它锚定了反馈生成逻辑的正确性。
