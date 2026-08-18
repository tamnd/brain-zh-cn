---
title: "CF 102249B - 蛙跳：第 1 章 2"
description: "我们有一排用字符串表示的睡莲。 第一个字符始终是 A，代表 Alpha Frog，而后面的每个字符要么是 B，代表 Beta Frog，要么是 .，代表空垫。"
date: "2026-08-17T21:58:06+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102249
codeforces_index: "B"
codeforces_contest_name: "2019 Facebook Hacker Cup, Qualification Round"
rating: 0
weight: 102249
solve_time_s: 103
verified: true
draft: false
---

[CF 102249B - 蛙跳：第 1 章 2](https://codeforces.com/problemset/problem/102249/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 43s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一排用字符串表示的睡莲。 第一个字符始终是`A`，代表阿尔法青蛙，而后面的每个角色都是`B`，代表 Beta 青蛙，或`.`，代表一个空垫。 

阿尔法青蛙从第一个垫开始，想要到达最后一个垫。 贝塔青蛙可以将一个位置移动到相邻的空垫中。 阿尔法青蛙有不同的动作：它可能会跳过一个或多个贝塔青蛙的连续方块，并立即落在该方块之后的第一个空垫上。 与第一章不同的是，阿尔法青蛙可以向任一方向跳跃。 我们只需要决定某些合作动作序列是否最终可以将 Alpha 放在最后一个垫子上。 

对于每个测试用例，输入都会给出一个这样的字符串。 输出是`Y`如果阿尔法青蛙能到达最右边的垫子并且`N`否则。 

长度可以长达 5,000，并且最多可以有 500 个测试用例。 对配置进行模拟是完全不切实际的，因为可能的排列数量随着焊盘数量呈指数增长。 即使每个测试用例执行二次工作量的算法也不必要地昂贵。 每个字符串的线性扫描很容易就足够小，因为如果每个案例都有最大长度，则所有测试案例最多会检查 250 万个字符。 

在一些小情况下，粗心的实施会给出错误的答案。 为了`A.`，答案是`N`：Alpha 没有 Beta 青蛙可以跳过，而移动 Beta 是不可能的，因为没有。 为了`AB`，答案也是`N`，尽管 Alpha 旁边有一个 Beta Frog，因为它后面没有空垫。 为了`AB.`，答案是`Y`：阿尔法跳过单个贝塔青蛙并降落在最后一个垫子上。 最后，`ABB`是`N`：Alpha 之后的两个着陆点都包含 Beta Frogs，因此没有着陆垫。 一个常见的错误是只检查是否至少有一只 Beta Frog，而不检查着陆场是否存在。 

允许阿尔法双向跳跃的新规则创造了另一个微妙的情况。 对于两只或更多贝塔青蛙，答案可以是`Y`即使没有足够的 Beta Frogs 来满足通常的单向蛙跳条件。 例如，`A.B..BBB.`拥有三只贝塔青蛙并且可以到达。 完全像第一章一样对待它会错误地拒绝它。 

## 方法

 直接的暴力方法是将青蛙的每个完整排列视为一个状态并执行广度优先搜索。 从一个状态开始，我们可以枚举每个合法的 Beta 移动和每个合法的 Alpha 跳跃，然后从每个新发现的状态继续。 这是正确的，因为青蛙移动的每个合法序列都对应于该状态图中的一条路径，因此在最后一个垫上达到具有 Alpha 的状态正是所需的条件。 

问题在于州的数量。 如果Alpha可以占据任何一个`N`位置，并且每个其他位置独立地包含 Beta Frog 或空垫，则可以有`N * 2^(N-1)`不同的配置。 检查最多`O(N)`每个配置的可能移动给出了最坏情况的转换检查计数`O(N^2 * 2^N)`。 为了`N = 5000`，这不太可行。 

The useful observation is that the detailed positions of the Beta Frogs do not matter for the final decision. 只有它们的数量才重要。 让`n = N - 1`，Alpha 起始焊盘之后的焊盘数量，并令`b`是 Beta 青蛙的数量。 

存在三个结构条件。 

首先，如果`n = 1`, Alpha 永远无法到达第二个焊盘。 右侧只有一个着陆垫，要么它是空的，阿尔法无法跳跃，要么它包含一只贝塔青蛙，并且没有空的着陆垫。 

其次，如果 Alpha 之后的每个垫都被 Beta Frog 占据，那么`b = n`，任何地方都没有空的着陆场。 阿尔法无法移动。 

有趣的部分是当`b < n`，因此至少存在一个空垫。 由于只有一只 Beta Frog，旧的越级限制仍然适用。 一只贝塔青蛙可以充当阿尔法跳过的物体，但当阿尔法跳过它之后，贝塔青蛙就在阿尔法的后面。 没有第二个 Beta Frog 可以用来创造另一个有用的跳跃。 为了`b = 1`，唯一成功的案例是`n = 2`，即`AB.`。 

有了至少两只贝塔青蛙，第二章彻底改变了情况。 两只 Beta Frog 可以与空垫配合创建重复的局部模式，让 Alpha 取得进展，而无需将新的 Beta Frog 向目的地移动一个位置。 具有代表性的局部变换是```
ABB.. -> AB.B. -> .BAB. -> .B.BA
```第一个 Beta 青蛙移入可用的洞中，然后 Alpha 立即跳过右侧的 Beta 青蛙，Alpha 可以继续使用第二个 Beta 青蛙。 同样的想法可以通过行移动。 只要有至少一个空垫和至少两只 Beta 青蛙，青蛙就可以重新排列自己，这样这种两个 Beta 机制就能让 Alpha 向目的地移动。 这是第 2 章中介绍的附加可能性。该标准与已建立的问题解决方案特征一致。 

第 1 章阈值也可以写为`b >= ceil(n / 2)`。 在第 2 章中，该阈值仅与少于两个 Beta Frogs 的案例相关，因为每个案例都有`b >= 2`只要有空垫就已经可以到达。 因此，一个方便的实现是```
n = N - 1
b = number of B characters

if n == 1: N
else if b == n: N
else if b >= ceil(n / 2): Y
else if b >= 2: Y
else: N
```这`ceil(n / 2)`条件完全处理单 Beta 情况，而`b >= 2`捕捉新的第 2 章机制。 这也是已发布的解决方案中使用的紧凑表征。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(N^2 2^N)`|`O(N 2^N)`| 太慢了 |
 | 最佳 |`O(N)`|`O(1)`除了输入字符串 | 已接受 |

 ## 算法演练

 1. 读取字符串并让`n = len(s) - 1`。 我们排除了最初的`A`因为所有相关的运动都发生在其右侧的焊盘之间。 
2.数数`b`的`B`人物。 一旦我们知道了上述结构条件，这些贝塔青蛙的确切位置就不再需要了。 
3.如果`n == 1`，立即回答`N`。 Alpha 无法合法地跨越 Beta Frog 并仍然降落在某个地方。 
4. 如果`b == n`， 回答`N`。 Alpha 之后的每个着陆垫都被占用，因此没有空的着陆垫。 
5. 计算`ceil(n / 2)`作为`(n + 1) // 2`。 如果`b`至少是这个值，回答`Y`。 这涵盖了标准的蛙式布置，包括唯一有用的带有一个 Beta Frog 的箱子。 
6. 如果前面的条件不成立但是`b >= 2`， 回答`Y`。 如果存在空垫，则两只 Beta 青蛙的存在会激活新的第 2 章机制。 这`b == n`案件已被拒绝，因此至少有一个漏洞可用。 
7. 如果前面的情况都不适用，请回答`N`。 这意味着Alpha的Beta青蛙太少而无法取得进展，并且特殊的双Beta机制不可用。 

为什么它有效：该算法将阻止任何移动的配置与具有有效合作机制的配置完全分开。 这`n == 1`情况下不可能有 Alpha 跳跃。 这`b == n`箱子没有可能的着陆平台。 当可用的 Beta Frog 少于两只时，普通的越级要求决定了 Alpha 是否有足够的支持来到达终点。 一旦存在两只 Beta 青蛙和至少一个空垫，它们的动作就可以创建第 2 章的两个 Beta 模式并推动 Alpha 前进。 因此，每个被接受的案例都有一个有效的动作序列，而每个被拒绝的案例都缺乏必要的结构。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(s):
    n = len(s) - 1
    b = s.count('B')

    if n == 1:
        return 'N'

    if b == n:
        return 'N'

    if b >= (n + 1) // 2:
        return 'Y'

    if b >= 2:
        return 'Y'

    return 'N'

def main():
    t = int(input())
    out = []

    for case_id in range(1, t + 1):
        s = input().strip()
        answer = solve_case(s)
        out.append(f"Case #{case_id}: {answer}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```这`solve_case`函数首先将字符串长度转换为`n`，Alpha 右侧的焊盘数量。 这直接匹配数学特征，并避免将初始 Alpha 垫混合到青蛙计数条件中。`str.count('B')`给出决策所需的有关字符串的唯一信息。 无需修改布置或模拟 Beta Frog 动作。 

条件`b == n`必须先检查阳性条件。 例如，`ABB`有`n = 2`和`b = 2`，所以表达式`b >= (n + 1) // 2`是真的。 然而答案是`N`，因为阿尔法无处降落。 逆转这些检查会产生错误的答案。 

表达式`(n + 1) // 2`计算上限`n / 2`使用整数运算。 Python 整数在这里不存在溢出问题，并且与该语言的整数范围相比，所有值都很小。 

外循环添加所需的`Case #i: `前缀并在写入一次之前收集答案。 这使 I/O 保持简单，同时仍然可以轻松处理所有 500 个测试用例。 

## 工作示例

 对于示例 1，输入为`A.`。 

| 变量| 价值|
 | ---| ---|
 |`s`|`A.`|
 |`n`|`1`|
 |`b`|`0`|
 |`n == 1`| 真实 |
 | 回答 |`N`|

 第一个条件立即驳回该案。 Alpha 的右侧只有一个 pad，因此无法进行合法的 Alpha 跳跃。 

对于示例 2，输入为`AB.`。 

| 变量| 价值|
 | ---| ---|
 |`s`|`AB.`|
 |`n`|`2`|
 |`b`|`1`|
 |`n == 1`| 假 |
 |`b == n`| 假 |
 |`b >= ceil(n / 2)`|`1 >= 1`, 真实 |
 | 回答 |`Y`|

 单个 Beta Frog 位于中间垫上，最后一个垫是空的。 Alpha 可以跳过 Beta Frog 并直接降落在最后一个垫子上。 

对于第 2 章的具体示例，请考虑`A.B..BBB.`。 

| 变量| 价值|
 | ---| ---|
 |`s`|`A.B..BBB.`|
 |`n`|`8`|
 |`b`|`4`|
 |`n == 1`| 假 |
 |`b == n`| 假 |
 |`b >= ceil(n / 2)`|`4 >= 4`, 真实 |
 | 回答 |`Y`|

 这里的例子也满足普通阈值。 一个更具启发性的案例是`A.B..BBB.`调整行数后，与三只贝塔青蛙一起`A.B..BB..`， 在哪里`n = 8`和`b = 3`。 普通的第一章门槛需要四只贝塔青蛙，但第二章接受它，因为`b >= 2`还有一个空垫。 这正是允许阿尔法向任一方向移动所提供的额外力量。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(N)`每个测试用例| 计数`B`字符扫描一次字符串。 |
 | 空间|`O(1)`辅助| 只需要字符串、长度和 Beta 计数。 |

 和`N <= 5000`最多500个测试用例，即使最大理论输入也只有250万个字符左右。 每个案例的单次线性扫描都在该范围内。 该算法不会构造状态、执行递归或分配与可能的青蛙排列数量成比例的结构。 

## 测试用例```python
import sys
import io

def solve_case(s):
    n = len(s) - 1
    b = s.count('B')

    if n == 1:
        return 'N'
    if b == n:
        return 'N'
    if b >= (n + 1) // 2:
        return 'Y'
    if b >= 2:
        return 'Y'
    return 'N'

def solve_input(inp: str) -> str:
    data = inp.strip().splitlines()
    t = int(data[0])
    ans = []

    for case_id in range(1, t + 1):
        ans.append(f"Case #{case_id}: {solve_case(data[case_id])}")

    return "\n".join(ans)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    t = int(input())
    out = []

    for case_id in range(1, t + 1):
        s = input().strip()
        out.append(f"Case #{case_id}: {solve_case(s)}")

    print("\n".join(out))

    result = sys.stdout.getvalue().strip()

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return result

sample_input = """8
A.
AB.
ABB
A.BB
A..BB..B
A.B..BBB.
AB.........
A.B..BBBB.BB
"""

sample_output = """Case #1: N
Case #2: Y
Case #3: N
Case #4: Y
Case #5: Y
Case #6: Y
Case #7: N
Case #8: Y"""

assert run(sample_input) == sample_output, "provided samples"

assert run("""2
A.
AB
""") == """Case #1: N
Case #2: N""", "minimum-size cases"

assert run("""4
AB.
A.B
A.B.
A.BB
""") == """Case #1: Y
Case #2: Y
Case #3: N
Case #4: Y""", "boundary cases"

assert run("""3
A
""" .strip() + "\n" if False else """3
A.
A..
A...
""") == """Case #1: N
Case #2: N
Case #3: N""", "no Beta Frogs"

assert run("""2
ABBB
A.BB
""") == """Case #1: N
Case #2: Y""", "all occupied versus two-Beta mechanism"

assert run("2\nA" + "B" * 4999 + "\n" + "A" + "BB" + "." * 4997 + "\n") == \
       "Case #1: N\nCase #2: Y", "maximum-size cases"
```最小大小的情况检查长度为 2 的两个可能的字符串。 两者都不能将 Alpha 移动到最后一个垫，该垫捕获了特殊的`n == 1`健康）状况。 

边界情况区分`AB.`从`A.B.`。 前者有一只 Beta Frog 和足够成功跳跃的垫子，而后者有一只 Beta Frog 但垫子太多，所以必须被拒绝。`A.BB`即使普通阈值不是决定性原因，也会检查两个 Beta Frog 是否足够。 

无 Beta 案例验证空行不能以某种方式被视为有效的 Alpha 移动。 全部占用的情况`ABBB`验证`b == n`检查优先于正计数条件。 

最大尺寸测试检查完全被占用的后缀和仅包含两个 Beta Frog 的巨大字符串。 他们还验证了实现在以下情况下保持线性：`N = 5000`。 

| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`A.`和`AB`|`N`,`N`| 最小尺寸边界 |
 |`AB.`,`A.B`,`A.B.`,`A.BB`|`Y`,`Y`,`N`,`Y`| 一贝塔阈值和二贝塔规则|
 |`A.`,`A..`,`A...`|`N`,`N`,`N`| 没有贝塔青蛙|
 |`ABBB`,`A.BB`|`N`,`Y`| 没有着陆平台与第 2 章机制 |
 |`A`+ 4999`B`|`N`| 最大尺寸和完全占用的后缀|
 |`A`+`BB`+ 4997`.`|`Y`| 恰好有两只 Beta Frogs 的最大尺寸 |

 ## 边缘情况

 最小可能的输入是`A.`。 这里`n = 1`和`b = 0`，所以算法返回`N`在考虑任何其他条件之前。 这避免了错误地将空的第二个垫视为普通单步移动可到达的目的地。 

为了`AB`，我们有`n = 1`和`b = 1`。 算法仍然返回`N`从第一个条件来看。 虽然Alpha有一只Beta Frog可以跳过，但那只Beta Frog之后没有空垫，所以跳跃没有合法的着陆位置。 

为了`AB.`，我们有`n = 2`和`b = 1`。 第一个条件不成立，后缀未被完全占用，并且`b >= ceil(2 / 2)`是真的。 算法返回`Y`，匹配直接移动`A`超过`B`进入决赛`.`。 

为了`ABB`，我们有`n = 2`和`b = 2`。 阈值测试似乎会接受这种情况，因为`2 >= 1`，但算法会检查`b == n`首先并返回`N`。 Alpha之后的每个停机坪都被占用，因此没有着陆停机坪。 这个顺序是必要的。 

为了`A.B.`，我们有`n = 3`和`b = 1`。 单个 Beta Frog 不足以完成这么长的旅程。 上限阈值为`2`， 所以`b = 1`失败了，并且`b >= 2`也失败了。 答案是`N`。 

对于这样的情况`A.BB`，我们有`n = 3`和`b = 2`。 有一个空垫，所以`b != n`，两只 Beta 青蛙激活第 2 章机制。 算法返回`Y`。 仅基于旧运动模式的第一章解决方案可能会错误地处理这一更广泛的规则。 

最后，对于由以下组成的最大尺寸字符串`A`随后是 4,999`B`人物，`n = 4,999`和`b = 4,999`。 算法返回`N`立即，因为整个后缀已被占用。 对于由以下组成的最大尺寸字符串`A`， 二`B`字符和 4,997 个空垫，`b = 2 < n`，所以答案是`Y`。 这两个案例说明了为什么必须考虑贝塔青蛙的数量和至少一个空着陆场的存在。
