---
title: "CF 106310C - \u041c\u0430\u0433\u0438\u044f\u0441\u043b\u043e\u0432"
description: "该任务给出了三个小写英文单词。 如果这三个词全部不同，并且该短语包含一两个特殊词“see”、“belief”和“repeat”，但不是同时包含所有这三个词，那么 Eliza 就会认为该短语很神奇。"
date: "2026-06-25T07:46:33+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106310
codeforces_index: "C"
codeforces_contest_name: "\u041c\u0443\u043d\u0438\u0446\u0438\u043f\u0430\u043b\u044c\u043d\u044b\u0439 \u044d\u0442\u0430\u043f \u0412\u0441\u041e\u0428 \u043f\u043e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0442\u0438\u043a\u0435, 7-8 \u043a\u043b\u0430\u0441\u0441\u044b, \u041f\u0435\u0440\u043c\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439, 2025"
rating: 0
weight: 106310
solve_time_s: 31
verified: true
draft: false
---

[CF 106310C - \u041c\u0430\u0433\u0438\u044f \u0441\u043b\u043e\u0432](https://codeforces.com/problemset/problem/106310/C)

 **评级：** -
 **标签：** -
 **求解时间：** 31s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该任务给出了三个小写英文单词。 如果这三个单词全部不同并且该短语包含一两个特殊单词，则 Eliza 认为该短语具有神奇意义`see`,`believe`， 和`repeat`，但不是同时三个。 我们需要判断给定的三个单词是否满足这些规则并打印`YES`或者`NO`。 

输入大小故意很小：正好有三个字符串，每个字符串的长度最多为 15。这意味着即使直接与三个神奇单词进行比较也足够快了。 不需要高级的数据结构或优化。 检查每个单词并执行恒定工作量的解决方案实际上是即时的。 

主要的困难不是性能，而是正确解释条件。 该短语需要三个不同的单词，因此即使重复的单词很神奇，也必须拒绝重复的输入单词。 同时，三个输入中的魔法词的数量必须至少为1个，最多为2个。 

考虑输入：```
see
see
cat
```正确的输出是：```
NO
```一个粗心的解决方案，只计算出现了多少个神奇的单词，可能会发现`see`两次并错误地接受该短语。 单词本身必须是明确的。 

另一个边缘情况是：```
see
believe
repeat
```正确的输出是：```
NO
```所有三个特殊词都存在，但规则明确禁止使用这三个词。 

最后一个案例是：```
see
cat
dog
```正确的输出是：```
YES
```只出现一个所需的魔法词，这是允许的。 

## 方法

 一种直接的方法是将三个输入单词与三个特殊单词进行比较，并计算其中有多少属于神奇集合。 我们还将这些单词进行相互比较，以验证这三个单词是否不同。 由于只有三个单词，暴力破解方法可以简单地直接尝试所有条件。 

暴力版本已经是这里最佳的实际解决方案。 如果我们用操作来描述工作，则只有恒定数量的字符串比较，最多几十个字符检查，因为每个单词的长度最多为 15。即使对可能的检查进行详尽的方法也只能执行几百个原始操作。 

关键的观察结果是该问题没有隐藏的搜索空间。 我们不是在构建一个短语或探索单词的组合。 输入已经给出了整个短语，因此答案由两个属性决定：三个单词的唯一性以及其中神奇单词的数量。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(1) | O(1) | O(1) | O(1) | 已接受 |
 | 最佳| O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 将三个字读入数组。 将它们放在一起可以轻松检查魔法集合中的唯一性和成员资格。 
2. 检查三个单词是否成对不同。 如果任意两个位置包含相同的单词，则该短语不可能是神奇的，所以答案是`NO`。 
3. 计算三个单词中有多少个等于其中之一`see`,`believe`， 或者`repeat`。 该计数代表该短语中使用了多少个神奇单词。 
4. 如果计数正好为一或正好为二，则输出`YES`。 否则，输出`NO`。 

这样做的原因是原始规则可以完全简化为这两个检查。 第一个检查强制该短语具有三个不同的单词。 第二个检查强制特殊字的数量在允许的范围内。 

为什么有效：该算法会检查定义神奇短语的每条规则。 如果接受，则单词不同，并且特殊单词的数量既不是零也不是三个，因此满足所有要求。 如果它拒绝，则至少违反了一项规则，这意味着该短语不可能具有魔法。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    words = [input().strip() for _ in range(3)]

    if len(set(words)) != 3:
        print("NO")
        return

    magic = {"see", "believe", "repeat"}
    count = sum(1 for word in words if word in magic)

    if 1 <= count <= 2:
        print("YES")
    else:
        print("NO")

if __name__ == "__main__":
    solve()
```输入被读取为三个单独的行，因为问题总是提供三个单词。 这`set`转换会删除重复项，因此将其大小与三个直接比较，检查所有单词是否唯一。 

神奇的单词存储在一个集合中，因为成员资格检查是这里的自然操作。 然后程序计算三个输入中有多少属于该集合。 

最终条件仅接受一或二的计数。 使用范围检查可以避免意外接受零个魔法词或出现所有三个魔法词的禁止情况。 

不存在取决于输入大小的索引操作或循环，因此不存在边界问题。 整数溢出也是不可能的，因为存储的唯一整数是零到三之间的计数。 

## 工作示例

 示例1：

 输入：```
see
cat
dog
```| 步骤| 话| 独特的检查| 神奇计数 | 结果 |
 | --- | --- | --- | --- | --- |
 | 初始| 看，猫，狗| 三个不同的词 | 0 | 继续 |
 | 计数| 看，猫，狗| 通过 | 1 | 是 |

 此示例显示了仅使用一个神奇单词的最小可接受情况。 

示例2：

 输入：```
see
believe
repeat
```| 步骤| 话| 独特的检查| 神奇计数 | 结果 |
 | --- | --- | --- | --- | --- |
 | 初始| 看到、相信、重复| 三个不同的词 | 0 | 继续 |
 | 计数| 看到、相信、重复| 通过 | 3 | 否 |

 这个例子说明了为什么计算神奇单词是必要的。 不允许同时拥有这三个特殊词。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 仅处理三个单词，每个单词都有有限的长度。 |
 | 空间| O(1) | O(1) | 该程序仅存储三个单词和一组固定的三个神奇单词。 |

 约束足够小，使得解决方案使用的时间和内存远远少于可用时间和内存限制。 如果测试的短语数量很大，该方法也将保持高效，因为每个单独的短语只需要不断的工作。 

## 测试用例```python
import sys
import io

def solution(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    words = [sys.stdin.readline().strip() for _ in range(3)]

    if len(set(words)) != 3:
        ans = "NO"
    else:
        magic = {"see", "believe", "repeat"}
        count = sum(1 for word in words if word in magic)
        ans = "YES" if 1 <= count <= 2 else "NO"

    sys.stdin = old_stdin
    return ans + "\n"

assert solution("see\ncat\ndog\n") == "YES\n", "one magical word"
assert solution("see\nbelieve\nrepeat\n") == "NO\n", "all magical words"
assert solution("see\nsee\ncat\n") == "NO\n", "duplicate words"
assert solution("hello\nworld\ncat\n") == "NO\n", "no magical words"
assert solution("repeat\nabc\nbelieve\n") == "YES\n", "two magical words"
assert solution("a\nb\nc\n") == "NO\n", "minimum length ordinary words"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`see, cat, dog`|`YES`| 允许的最小魔法字数 |
 |`see, believe, repeat`|`NO`| 三个神奇单词的禁忌案件 |
 |`see, see, cat`|`NO`| 重复词检测 |
 |`hello, world, cat`|`NO`| 没有神奇文字出现时的拒绝 |
 |`repeat, abc, believe`|`YES`| 用两个神奇的词来接受|
 |`a, b, c`|`NO`| 处理简短的普通单词|

 ## 边缘情况

 对于重复的单词，输入```
see
see
cat
```立即被拒绝。 单词集的大小为 2 而不是 3，因此算法永远不会达到神奇的单词计数检查。 这可以防止重复的神奇单词被误认为是有效的短语。 

对于所有三个神奇词都存在的情况：```
see
believe
repeat
```唯一性条件成功，因为单词不同。 魔法计数变为三，最终条件拒绝它，因为只允许一两个魔法词。 

对于只包含一个神奇单词的短语：```
see
apple
tree
```唯一性条件成功，神奇计数为一。 该算法接受它，因为一个神奇的单词就足够了。 

对于没有魔法词的短语：```
apple
tree
stone
```唯一性条件成功，但计数为零。 该算法会拒绝它，因为每个有效短语必须至少包含三个特殊单词之一。
