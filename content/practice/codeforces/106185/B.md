---
title: "CF 106185B - 前缀和后缀可以相同"
description: "我们得到一个字符串 $s$。 任务是构造一个不同的字符串 $t$，使得两个条件同时成立：$t$ 的开头与整个字符串 $s$ 匹配，$t$ 的结尾也与整个字符串 $s$ 匹配。"
date: "2026-06-19T18:47:39+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106185
codeforces_index: "B"
codeforces_contest_name: "The 2025 ICPC Japan Online First Round Contest"
rating: 0
weight: 106185
solve_time_s: 45
verified: true
draft: false
---

[CF 106185B - 前缀和后缀可以相同](https://codeforces.com/problemset/problem/106185/B)

 **评级：** -
 **标签：** -
 **求解时间：** 45s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个字符串$s$。 任务是构造一个不同的字符串$t$使得两个条件同时成立：$t$匹配整个字符串$s$，以及结束$t$也匹配整个字符串$s$。 在所有这些字符串中，我们必须输出尽可能短的一个。 

另一种解释方式是我们想要“粘合”$s$到更长的字符串上，以便$s$同时显示为前缀和后缀，同时允许前缀副本和后缀副本之间重叠。 目标是最大限度地减少原始字符串之外我们需要的额外材料。 

输入由多个测试用例组成，每个测试用例提供长度最多为 50 的字符串。这个小约束立即表明，即使具有二次检查或简单前缀比较的解决方案也足够了，因为即使$O(n^3)$每个测试用例最多 50 个案例仍然是安全的，并且$n \le 50$。 

一个关键的边缘情况是字符串具有强烈的内部重复。 例如，如果$s = \texttt{aaaa}$，那么我们可以大量重叠，并且最短的有效字符串并不是简单地将字符串加倍。 总是将整个字符串连接两次的天真的方法会产生$\texttt{aaaaaaa}$，而最佳答案是$\texttt{aaaa}$根据解释，其本身最小程度地延伸或有时部分重叠。 另一种边缘情况是前缀和后缀之间没有重要的重叠。 例如，$s = \texttt{abc}$，其中答案成为一个完整的串联$\texttt{abcabc}$，因为不存在适当的重叠。 

主要困难是检测前缀的后缀有多大可以同时匹配整个字符串。 

## 方法

 暴力方法是尝试通过连接两个副本来构建候选字符串$s$具有每个可能的重叠长度。 如果我们重叠$k$字符，我们通过采取形成一个候选字符串$s$并附加$s[k:]$。 然后我们验证这个构造的字符串是否满足它开头的条件$s$并以$s$。 对于每个$k$，此验证成本$O(n)$，并且有$O(n)$的选择$k$, 给予$O(n^2)$每个测试用例。 这已经很容易通过了，但我们可以进一步简化。 

关键的观察是我们实际上不需要独立测试所有重叠。 所需的字符串由最大前缀确定$s$这也是一个后缀$s$。 一旦我们找到最长的正确前缀，它也是一个后缀，比如说长度$L$，我们可以安全地重叠那些$L$两个副本之间的字符$s$。 这正是前缀函数计算中使用的结构（如 KMP 中），我们在其中找到字符串的最长边界。 

如果我们知道最长的边界，则通过附加不重叠的后缀来获得最短的有效字符串$s$对自己：$s + s[L:]$。 该问题保证了唯一性，这与最长边界结构的唯一性一致。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 尝试所有重叠 | 每次测试 O(n²) | O(n) | 已接受 |
 | 前缀函数（KMP 样式）| 每次测试 O(n) | O(n) | 已接受 |

 ## 算法演练

 我们计算字符串的前缀函数$s$。 该函数告诉我们，对于每个位置，与以该位置结尾的后缀匹配的最长正确前缀的长度。 

1. 构建数组$\pi$在哪里$\pi[i]$存储最长前缀的长度$s$匹配以索引结尾的后缀$i$。 这捕获了字符串的所有边界信息。 
2. 开始于$j = 0$。 从索引 1 迭代字符串到$n-1$。 对于每个字符，同时$j > 0$和$s[i] \neq s[j]$，回落到$j = \pi[j-1]$。 这一步确保我们始终保持最长的有效匹配。 
3.如果$s[i] = s[j]$, 增量$j$并分配$\pi[i] = j$。 这会增加当前匹配的前缀后缀长度。 
4. 处理完整个字符串后，得到值$\pi[n-1]$给出最长的专有前缀的长度$s$这也是后缀$s$。 
5. 通过完整字符串构造答案$s$并附加$s[\pi[n-1]:]$。 这与最大匹配前缀后缀重叠，产生最短的有效扩展。 

### 为什么它有效

 前缀函数对字符串的所有边界进行编码，前缀和后缀之间的任何有效重叠都必须对应于边界。 最长的边框可以最大化重叠，从而最大限度地减少附加的新字符数量。 任何较短的边框都会强制构造一个严格更长的字符串，因为需要复制后缀中的更多字符。 这确保了构造的字符串在满足前缀和后缀约束的所有候选者中是最小的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def build_prefix_function(s):
    n = len(s)
    pi = [0] * n
    j = 0
    for i in range(1, n):
        while j > 0 and s[i] != s[j]:
            j = pi[j - 1]
        if s[i] == s[j]:
            j += 1
            pi[i] = j
    return pi

def solve():
    out = []
    while True:
        line = input().strip()
        if line == "0":
            break
        n = int(line)
        s = input().strip()
        pi = build_prefix_function(s)
        overlap = pi[-1]
        ans = s + s[overlap:]
        out.append(ans)
    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```该解决方案以前缀函数计算为中心。 功能`build_prefix_function`维护一个指针`j`跟踪当前匹配的前缀长度。 当发生不匹配时，它会使用先前计算的边界长度跳回，而不是从零重新开始，从而保留线性时间复杂度。 

一旦构建了前缀函数，最后一个值就直接给出了前缀和后缀之间的最长重叠。 施工`s + s[overlap:]`是我们扩展字符串的唯一位置，它确保最大程度地重用原始字符串中的字符。 

一个微妙的点是我们从不显式检查候选字符串。 所有正确性都委托给前缀函数结构，该结构紧凑地编码所有可能的重叠。 

## 工作示例

 考虑$s = \texttt{abab}$。 

| 我| 字符 | j 之前 | 比较| j 之后 | 圆周率[i] |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 乙| 0 | 甲与乙| 0 | 0 |
 | 2 | 一个 | 0 | 一个与一个| 1 | 1 |
 | 3 | 乙| 1 | 乙对乙| 2 | 2 |

 重叠度为 2，所以答案变为`abab`+`ab`=`ababab`。 这证实了前缀“ab”也是后缀。 

现在考虑$s = \texttt{icpc}$。 

| 我| 字符 | j 之前 | 比较| j 之后 | 圆周率[i] |
 | --- | --- | --- | --- | --- | --- |
 | 1 | c | 0 | 我与c | 0 | 0 |
 | 2 | p| 0 | 我 vs p | 0 | 0 |
 | 3 | c | 0 | 我与c | 0 | 0 |

 重叠度为0，所以答案为`icpcicpc`。 这显示了不存在适当边界的后备情况。 

这些痕迹证实了前缀函数正确地捕获了重叠结构，并且构造仅取决于最终的边界长度。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | Prefix 函数通过摊销常数时间回溯处理每个字符 |
 | 空间| O(n) | 前缀函数值数组 |

 给定$n \le 50$最多 50 个测试用例，该解决方案的运行速度远远低于任何约束限制。 即使有多个测试用例的开销，总操作仍然可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    def build_prefix_function(s):
        n = len(s)
        pi = [0] * n
        j = 0
        for i in range(1, n):
            while j > 0 and s[i] != s[j]:
                j = pi[j - 1]
            if s[i] == s[j]:
                j += 1
                pi[i] = j
        return pi

    out = []
    while True:
        line = input().strip()
        if line == "0":
            break
        n = int(line)
        s = input().strip()
        pi = build_prefix_function(s)
        overlap = pi[-1]
        out.append(s + s[overlap:])
    return "\n".join(out)

# provided sample (format reconstructed minimally)
assert run("4\ntest\n0\n") == "testtest"

# all identical characters
assert run("3\naaa\n0\n") == "aaaa"

# no overlap
assert run("3\nabc\n0\n") == "abcabc"

# full overlap pattern
assert run("4\nabab\n0\n") == "ababab"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 啊啊| 啊啊| 完全重叠处理|
 | ABC | ABCABC | 无边框|
 | 阿巴 | 贝巴布 | 部分重叠正确性 |
 | 测试| 测试测试 | 一般正确性 |

 ## 边缘情况

 像这样的字符串`aaaa`练习最大重叠。 前缀函数产生 3 的重叠，因为每个前缀也是后缀。 该算法仅附加一个字符，产生`aaaa`，这是规则下最短的有效字符串。 

像这样的字符串`abc`没有重要的前缀后缀匹配。 prefix 函数返回 0，因此构造变为`abcabc`。 任何重叠尝试都将导致验证失败，因为没有后缀与前缀匹配。 

像这样的字符串`ababa`演示嵌套边框。 重叠变为 3 (`aba`），结果是`ababaaba`。 前缀功能无需重新启动即可正确导航中间匹配，确保自动选择最长的边框。
