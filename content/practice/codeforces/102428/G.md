---
title: "CF 102428G - 粘合图片"
description: "城市名称是字符串C。图片可以捕获C的任何连续部分，因此C的每个子字符串都是可能的图片。 我们可以按任意顺序排列图片并将其内容连接起来以获得朋友的名字。"
date: "2026-08-12T07:15:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102428
codeforces_index: "G"
codeforces_contest_name: "2019-2020 ACM-ICPC Latin American Regional Programming Contest"
rating: 0
weight: 102428
solve_time_s: 118
verified: true
draft: false
---

[CF 102428G - 粘合图片](https://codeforces.com/problemset/problem/102428/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 城市名称是一个字符串`C`。 一张图片可以捕捉任意连续的部分`C`，所以每个子串`C`是一个可能的画面。 我们可以按任意顺序排列图片并将其内容连接起来以获得朋友的名字。 单张图片中的字符无法更改、反转或重新排列。 

对于每个朋友的字符串`P`，我们需要最小数量的子串`C`其串联恰好是`P`。 城市名称中出现的任何部分都可以拍照，因此必要时可以再次使用同一部分。 

例如，与`C = MONTEVIDEO`, 字符串`DEMONIO`可以拆分为`DE | MON | I | O`。 每一块都是一个连续的子串`C`，并且各个片段的出现顺序可以不同于它们在城市名称中的位置。 答案是四个。 

所有好友字符串的总长度最多为`2 * 10^5`。 城市字符串本身是固定文本，从中获取所有可能的片段。 官方裁判给出了2秒的时间限制和1024MB的内存。 检查每个朋友的每个可能子串的解决方案是朋友长度的二次方，这意味着大约`2 * 10^10`一位长度为友的候选子串`2 * 10^5`。 这远远超出了时限内可以处理的范围。 我们需要对总输入大小进行本质上的线性工作。 

有几种边缘情况可能会使看似合理的实现变得错误。 

考虑```
A
2
A
B
```答案是`1`和`-1`。 一旦某些必需的字符不能以城市的任何子串开头，朋友就不可能存在。 在匹配失败后盲目增加棋子数量的实现可能会意外地计算出不可能的棋子而不是报告`-1`。 

考虑```
ABA
1
ABAB
```答案是`2`， 使用`ABA | B`。 贪婪的实现必须允许下一张图片从朋友的任何角色开始，包括也是之前使用的图片的一部分的角色。 将图片限制在城市中不重叠的位置将解决另一个问题。 

考虑```
ABC
1
CBA
```答案是`3`， 使用`C | B | A`。 图片的顺序不受限制，但图片内的字符则不受限制。 倒车`ABC`获得`CBA`是不允许的，所以一张照片不能组成整个朋友。 

最后，```
AAA
1
AAAA
```有答案`2`， 使用`AAA | A`。 城市的同一部分可以再次拍摄，因此第一张照片已被使用`AAA`不会将其从可能的图片集中删除。 

## 方法

 直接的方法是动态规划。 让`dp[i]`是构造第一个图片所需的最少图片数`i`朋友的性格。 从位置`i`，我们可以尝试每个结束位置`j`，检查是否`P[i:j]`发生在内部某处`C`，并更新`dp[j]`。 

这是正确的，因为每个有效的构造都有一些最终图片，并且 DP 会考虑该最终子串的所有可能选择。 问题是我们必须检查的子串的数量。 一个有长度的朋友`m`正好有`m(m+1)/2`非空子串。 为了`m = 200000`， 那是`20000100000`，大约有 200 亿候选人，甚至没有考虑检查每个候选人是否出现在该城市的成本。 

我们可以将城市的所有子串预处理成一个集合，但这会在城市一侧产生相同的二次障碍。 一座有长度的城市`L`有`L(L+1)/2`要考虑的子字符串出现次数。 即使随后进行恒定时间哈希集查找，当`L`很大。 

有用的观察是，我们实际上不需要考虑每一个可能的下一个部分。 假设我们当前正在尝试构造后缀`P[i:]`。 让`G`是最长的前缀`P[i:]`作为子串出现`C`。 

选择`G`总是至少与选择较短的第一张图片一样好。 采取任何第一张图片有长度的最佳结构`k`， 在哪里`k <= |G|`。 自从`G`本身是一个子串`C`，它可以替换该结构的前几张图片。 如果`G`在其中一张图片中结束，该图片未使用的后缀本身就是`C`，因为子串的每个子串也是`C`。 这样就可以在不使用更多图片的情况下调整结构。 

这给出了一个贪心规则：在朋友的每个位置，取该城市中出现的最长前缀。 

剩下的任务是快速找到最长的前缀。 后缀自动机正是字符串所有子串的紧凑表示。 从其初始状态开始，并跟随朋友角色的转变，可以告诉我们当前前缀在城市中持续出现的时间。 当缺少过渡时，当前前缀是最长的可能图片。 

蛮力方法之所以有效，是因为它明确地探索了所有可能的分割。 它失败了，因为候选块的数量是平方数。 最长的可能的第一块总是可以替换较短的初始块的观察结果将问题简化为重复查找一个最长出现的前缀。 后缀自动机直接在线性时间内执行这些子字符串检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 带有所有子串的暴力 DP | O(L² + M²) 与子字符串预处理 | O(L²) | 太慢了|
 | 最优贪心+后缀自动机 | O(L + M) | O(L) | 已接受 |

 这里`L = |C|`和`M`是所有友元字符串的长度之和。 

## 算法演练

 1. 为城市字符串构建后缀自动机`C`。 

后缀自动机最多有`2L - 1`准确地陈述并识别子串的集合`C`。 从其初始状态开始，当该序列是以下字符的子串时，可以精确地遵循一系列字符转换`C`。 
2. 对于每个好友字符串`P`, 从位置开始`pos = 0`并将答案设置为零。 

在此刻`P[pos:]`是尚未建造的部分。 我们总是希望选择一张尽可能多地涵盖该后缀的图片。 
3. 从自动机的初始状态开始，使用以下命令跟踪转换`P[pos]`,`P[pos + 1]`，依此类推，直到好友结束或所需的转换不存在。 

假设遍历消耗`len`人物。 然后`P[pos:pos+len]`是城市的子串，而下一个字符不能将其扩展为更长的子串。 因此，这正是最长的第一张图片。 
4.如果`len`为零，输出`-1`。 

城市的子字符串不以以下开头`P[pos]`，因此没有可能的图片可以产生下一个所需的字符。 由于接下来每个构造都必须产生该字符，因此无法形成朋友。 
5. 否则，将答案加一并前进`pos`经过`len`。 

消耗的前缀现在由一张图片表示。 我们从初始状态重新开始后缀自动机遍历，因为下一张图片是城市的独立子串。 
6. 重复此操作，直到好友的所有角色都被消耗完。 

每次迭代至少消耗一个朋友角色，因此最多可以有`|P|`迭代。 

### 为什么它有效

 考虑从位置开始的一次贪婪迭代`pos`。 让`G`是最长的前缀`P[pos:]`这是一个子串`C`。 任何有效的构造都必须以某个子字符串开头`X`的`C`， 和`X`不能长于`G`。 

如果最佳构造开始于`X`，然后继续浏览其后续图片，直到至少`|G|`字符已被覆盖。 用单张图片替换整个初始部分`G`。 如果`G`在图片的中间结束，该图片的剩余后缀仍然是子串`C`，这样就可以成为下一张图片了。 图片数量没有增加。 

因此总存在一个最优解，其第一张图就是贪心选择`G`。 移除后`G`，相同的参数独立适用于其余后缀。 通过贪婪迭代的归纳，该算法产生尽可能少的图片数量。 

后缀自动机给出了精确的`G`因为每个成功的转换都会扩展一个子串`C`，而第一个缺失的转换证明不再有前缀出现在`C`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SuffixAutomaton:
    def __init__(self, s):
        self.next = [{}]
        self.link = [-1]
        self.length = [0]
        self.last = 0

        for ch in s:
            self.extend(ch)

    def extend(self, ch):
        cur = len(self.next)
        self.next.append({})
        self.length.append(self.length[self.last] + 1)
        self.link.append(0)

        p = self.last

        while p != -1 and ch not in self.next[p]:
            self.next[p][ch] = cur
            p = self.link[p]

        if p == -1:
            self.link[cur] = 0
        else:
            q = self.next[p][ch]

            if self.length[p] + 1 == self.length[q]:
                self.link[cur] = q
            else:
                clone = len(self.next)
                self.next.append(self.next[q].copy())
                self.length.append(self.length[p] + 1)
                self.link.append(self.link[q])

                while p != -1 and self.next[p].get(ch) == q:
                    self.next[p][ch] = clone
                    p = self.link[p]

                self.link[q] = clone
                self.link[cur] = clone

        self.last = cur

    def longest_prefix(self, s, start):
        state = 0
        pos = start

        while pos < len(s):
            nxt = self.next[state].get(s[pos])
            if nxt is None:
                break
            state = nxt
            pos += 1

        return pos - start

def solve():
    city = input().strip()
    n = int(input())

    sam = SuffixAutomaton(city)

    out = []

    for _ in range(n):
        friend = input().strip()
        pos = 0
        pieces = 0

        while pos < len(friend):
            length = sam.longest_prefix(friend, pos)

            if length == 0:
                pieces = -1
                break

            pos += length
            pieces += 1

        out.append(str(pieces))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```后缀自动机为每个状态存储三条信息。`length[v]`是该状态所表示的最大长度，`link[v]`是它的后缀链接，并且`next[v]`包含传出字符转换。 该构造遵循标准后缀自动机扩展程序，包括在新转换否则会违反自动机结构时克隆状态。 

这`longest_prefix`函数总是从状态零开始。 这是必要的，因为每张图片都是城市的任意子串，不一定是城市的前缀。 从初始状态开始意味着每个可能的子串都是可用的。 

循环在第一个丢失的转换处停止。 如果循环消耗了几个字符，则已知整个前缀出现在城市中。 缺少的转换证明将其再扩展一个字符是不可能的，因此匹配的长度是最大的。 

最微妙的边界情况是缺少第一个转换时。 然后`length == 0`，并不断前进`pos`会使算法永远循环或错误地计算图片。 代码立即返回`-1`为了那个朋友。 

当比赛成功时，`pos`在下一次迭代之前前进整个匹配长度。 我们不会一次前进一个字符，因为整个匹配的前缀已经被一张图片覆盖了。 

Python 中不存在整数溢出问题。 答案最多是朋友的长度，因此即使是 32 位整数也足以满足答案本身。 

该实现使用字典进行转换。 字母表仅包含大写英文字母，因此每个状态最多有 26 个传出转换。 固定的 26 元素数组可以减少低级语言中的字典开销，但字典使 Python 实现变得更加简单，同时保留线性渐近复杂性。 

## 工作示例

 对于第一个样本，城市是`MONTEVIDEO`。 官方样本有四个朋友，答案是`4`,`1`,`4`， 和`-1`。 

为了`DEMONIO`，贪心过程为：

 | 职位| 剩余后缀| 最长的城市子串 | 件 |
 | --- | --- | --- | --- |
 | 0 |`DEMONIO`|`DE`| 1 |
 | 2 |`MONIO`|`MON`| 2 |
 | 5 |`IO`|`I`| 3 |
 | 6 |`O`|`O`| 4 |

 第一场比赛是`DE`， 虽然`D`稍后出现在城市中。 下一场比赛是`MON`，在这座城市来得较早。 这证实了图片可以自由地重新排列。 自动机只关心每件作品是否发生在城市的某个地方。 

为了`EDIT`，第一个贪心匹配是`E`。 从剩余的`DIT`，最长可能的匹配是`D`， 然后`I`， 然后`T`。 结果跟踪是：

 | 职位| 剩余后缀| 最长的城市子串 | 件 |
 | --- | --- | --- | --- |
 | 0 |`EDIT`|`E`| 1 |
 | 1 |`DIT`|`D`| 2 |
 | 2 |`IT`|`I`| 3 |
 | 3 |`T`|`T`| 4 |

 所以答案是`4`。 这也说明了为什么贪心算法不需要知道子串出现在城市的哪个位置。 它只需要知道它发生了。 

对于第二个样本，城市是`SANTIAGO`，官方给出的答案是`3`,`1`， 和`3`。 

为了`TITA`，贪心匹配是：

 | 职位| 剩余后缀| 最长的城市子串 | 件 |
 | --- | --- | --- | --- |
 | 0 |`TITA`|`T`| 1 |
 | 1 |`ITA`|`I`| 2 |
 | 2 |`TA`|`TA`| 3 |

 结果是`3`。 决赛`TA`内部是连续的`SANTIAGO`，即使这两个字母与朋友之前使用的其他一些字母是分开的。 图片是独立的，因此不会造成任何限制。 

为了`SANTIAGO`本身，整个朋友就是城市字符串，因此自动机成功地跟踪每个字符：

 | 职位| 剩余后缀| 最长的城市子串 | 件 |
 | --- | --- | --- | --- |
 | 0 |`SANTIAGO`|`SANTIAGO`| 1 |

 答案是`1`，证明自动机可以将整个城市字符串识别为一张图片。 

## 复杂度分析

 让`L = |C|`并让`M`是所有友元字符串的长度之和。 

| 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(L + M) | 后缀自动机需要 O(L) 来构建，并且每个朋友角色都被一次成功的贪婪匹配所消耗，每件最多有一次失败的转换 |
 | 空间| O(L) | 后缀自动机的数量少于`2L`状态，并且存储的转换总数为 O(L) |

 好友总长度最多为`2 * 10^5`，因此查询处理在输入的有界部分是线性的。 自动机的构造在城市长度上也是线性的。 这完全在官方规定的 2 秒和 1024 MB 限制之内。 

## 测试用例

 以下测试工具包含相同的后缀自动机解决方案逻辑，并检查两个官方示例以及自定义案例。```python
import sys
import io

input = sys.stdin.readline

class SuffixAutomaton:
    def __init__(self, s):
        self.next = [{}]
        self.link = [-1]
        self.length = [0]
        self.last = 0

        for ch in s:
            self.extend(ch)

    def extend(self, ch):
        cur = len(self.next)
        self.next.append({})
        self.length.append(self.length[self.last] + 1)
        self.link.append(0)

        p = self.last

        while p != -1 and ch not in self.next[p]:
            self.next[p][ch] = cur
            p = self.link[p]

        if p == -1:
            self.link[cur] = 0
        else:
            q = self.next[p][ch]

            if self.length[p] + 1 == self.length[q]:
                self.link[cur] = q
            else:
                clone = len(self.next)
                self.next.append(self.next[q].copy())
                self.length.append(self.length[p] + 1)
                self.link.append(self.link[q])

                while p != -1 and self.next[p].get(ch) == q:
                    self.next[p][ch] = clone
                    p = self.link[p]

                self.link[q] = clone
                self.link[cur] = clone

        self.last = cur

    def longest_prefix(self, s, start):
        state = 0
        pos = start

        while pos < len(s):
            nxt = self.next[state].get(s[pos])
            if nxt is None:
                break
            state = nxt
            pos += 1

        return pos - start

def solve():
    city = input().strip()
    n = int(input())

    sam = SuffixAutomaton(city)
    out = []

    for _ in range(n):
        friend = input().strip()
        pos = 0
        pieces = 0

        while pos < len(friend):
            length = sam.longest_prefix(friend, pos)

            if length == 0:
                pieces = -1
                break

            pos += length
            pieces += 1

        out.append(str(pieces))

    sys.stdout.write("\n".join(out))

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_stdout = sys.stdout
    old_input = input

    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        input = sys.stdin.readline

        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        input = old_input

# Provided sample 1
assert run(
    """MONTEVIDEO
4
DEMONIO
MONTE
EDIT
WON
"""
) == "4\n1\n4\n-1", "sample 1"

# Provided sample 2
assert run(
    """SANTIAGO
3
TITA
SANTIAGO
NAS
"""
) == "3\n1\n3", "sample 2"

# Minimum-size city, impossible character, and exact match
assert run(
    """A
3
A
AA
B
"""
) == "1\n2\n-1", "minimum size and impossible character"

# Repeated characters and repeated use of the same picture
assert run(
    """AAA
3
AAAA
AAAAAA
B
"""
) == "2\n2\n-1", "repeated characters"

# Reordering pictures and greedy longest-prefix behavior
assert run(
    """ABC
4
CBA
ABAB
BCAB
ACAC
"""
) == "3\n2\n2\n4", "reordering and boundaries"

# Maximum-size linear test
city = "A" * 200000
large_input = city + "\n2\n" + ("A" * 200000) + "\n" + ("B" * 1) + "\n"
assert run(large_input) == "1\n-1", "maximum-size test"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`A`， 朋友们`A`,`AA`,`B`|`1`,`2`,`-1`| 最小尺寸、重复使用、不可能的字符 |
 |`AAA`， 朋友们`AAAA`,`AAAAAA`,`B`|`2`,`2`,`-1`| 全平等人物、同城版块重用 |
 |`ABC`， 朋友们`CBA`,`ABAB`,`BCAB`,`ACAC`|`3`,`2`,`2`,`4`| 任意图片顺序和贪婪的最长前缀选择 |
 |`A * 200000`， 朋友们`A * 200000`,`B`|`1`,`-1`| 最大尺寸输入和线性处理|

 ## 边缘情况

 对于不可能的第一个角色，请考虑```
ABC
1
D
```自动机从初始状态开始并立即寻找转变`D`。 没有，因此最长前缀的长度为零。 算法输出`-1`。 不算数`D`作为一张单字图片，因为`D`不会发生在城市中。 

对于比城市还要长但完全由可重复的部分组成的朋友，请考虑```
AAA
1
AAAA
```第一次遍历消耗`AAA`，因为这是该城市中出现的最长前缀。 剩下的后缀是`A`，它本身就是城市的一个子串。 答案是`2`。 自动机仅重建一次，并且同一个自动机可以重复使用，因为图片不是选择后消失的资源。 

对于任意图片排序，请考虑```
ABC
1
CBA
```第一次遍历发现`C`，那么接下来从自动机的初始状态开始，找到`B`，则最终遍历发现`A`。 答案是`3`。 该算法从不尝试保留所选图片在城市内的位置，这正是问题所允许的。 

对于贪婪边界情况，考虑```
ABA
1
ABAB
```第一次遍历需要`ABA`，因为它是城市的子字符串，并且不再可能有前缀。 剩下的朋友是`B`，又拍摄一张照片。 答案是`2`。 较短的第一选择，例如`AB`也会导致有效的构造，但它不能改进答案，这正是贪婪证明背后的性质。 

对于一个等同于这座城市本身的朋友来说，```
SANTIAGO
1
SANTIAGO
```自动机跟随每个字符，不会遇到丢失的转换。 最长的前缀长度为 8，因此整个朋友在一次迭代中被消耗掉，答案是`1`。 这会检查匹配到达查询末尾的边界，而不是因为缺少转换而结束。
