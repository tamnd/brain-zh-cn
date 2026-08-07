---
title: "CF 104146A - 男性和女性的基本知识"
description: "我们得到一个代表褪色姓名标签的短字符串。 已知原始名称恰好是三个固定字符串之一：Alice、Bob 或 Cindy。 然而，观察到的字符串可能包含小写或大写字母，并且某些位置可能不可读，显示为点。"
date: "2026-07-02T01:32:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104146
codeforces_index: "A"
codeforces_contest_name: "Abakoda Long Contest 2022"
rating: 0
weight: 104146
solve_time_s: 45
verified: true
draft: false
---

[CF 104146A - 男性和女性的基本知识](https://codeforces.com/problemset/problem/104146/A)

 **评级：** -
 **标签：** -
 **求解时间：** 45s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个代表褪色姓名标签的短字符串。 已知原始名称恰好是三个固定字符串之一：Alice、Bob 或 Cindy。 然而，观察到的字符串可能包含小写或大写字母，并且某些位置可能不可读，显示为点。 每个点可以代表任何单个英文字母。 

任务是确定在用合适的字母替换每个点后，三个名称中的哪一个仍然可以匹配观察到的模式。 如果名称与观察到的字符串逐个字符匹配、尊重大小写并允许点匹配任何内容，则该名称被视为有效。 

输出取决于三个名称中有多少是兼容的。 如果恰好有一个名称适合，我们就会输出该名称。 如果适合多个名称，则信息不足，我们输出 CAN'T TELL。 如果没有一个名称适合，我们会输出 SOMETHING'S WRONG。 

输入的大小非常小，最多 5 个字符。 这立即排除了任何复杂的预处理或优化的需要。 与每个候选人姓名进行直接比较就足够了。 

当输入仅包含点时，会出现微妙的边缘情况。 例如，像“.....”这样的输入会匹配所有三个名称，因为每个字符都可以自由选择。 在这种情况下，正确的输出是 CAN'T TELL，而不是名称之一。 另一种情况是出现大小写不匹配的情况，例如“bob”与“Bob”，其中必须完全相等； 天真的不区分大小写的比较会错误地接受无效的匹配。 

## 方法

 蛮力方法已经与问题的结构相匹配。 我们只需尝试三个候选名称中的每一个，并通过验证每个位置来检查它是否可以与输入字符串匹配。 输入中的点充当通配符，因此它始终匹配。 任何固定字符都必须完全匹配。 

由于只有三个候选者，并且每个字符串的长度最多为 5，因此总工作量是恒定的。 即使我们扩展了候选集，结构仍将保持简单的模式匹配。 

关键的观察是我们不需要构建这些点的所有可能的解释。 这将导致点数呈指数级爆炸。 相反，我们直接测试兼容性：如果候选字符不与输入中的固定字符冲突，则该候选字符是有效的。 这减少了从组合生成到确定性检查的问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模式扩展| O(3·26^k) | O(3·26^k) | O(1) | O(1) | 原则上太慢|
 | 直接匹配检查| O(3·n) | O(3·n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取代表褪色姓名标签的输入字符串。 我们将其视为一种模式，其中字母是固定约束，点是通配符。 
2. 将三个候选名称 Alice、Bob 和 Cindy 存储为固定参考字符串。 
3. 对于每个候选名称，将其与输入字符串逐个字符进行比较。 
4. 在每个位置，如果输入字符是点，我们接受候选字符中的任何对应字符。 如果不是点，我们要求与候选人的性格完全匹配。 
5. 如果所有职位都与候选人匹配，则将其标记为有效。 
6. 检查完所有三个候选后，计算有多少个是有效的。 
7. 如果恰好有一个候选有效，则输出它。 如果多个有效，则输出 CAN'T TELL。 如果没有一个有效，则输出 SOMETHING'S WRONG。 

### 为什么它有效

每个点代表一个自由选择，因此它对候选字符串没有任何限制。 每个非点字符都是必须满足的硬约束。 因此，有效性简化为检查候选字符串是否与所有固定约束一致。 由于我们独立验证每个候选者的所有约束，因此我们不能错误地接受违反任何固定字符的名称，并且我们不能拒绝名称，除非它与至少一个约束冲突。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def matches(pattern, name):
    if len(pattern) != len(name):
        return False
    for pc, nc in zip(pattern, name):
        if pc != '.' and pc != nc:
            return False
    return True

def solve():
    s = input().strip()
    candidates = ["Alice", "Bob", "Cindy"]

    valid = []
    for name in candidates:
        if matches(s, name):
            valid.append(name)

    if len(valid) == 1:
        print(valid[0])
    elif len(valid) > 1:
        print("CAN'T TELL")
    else:
        print("SOMETHING'S WRONG")

if __name__ == "__main__":
    solve()
```匹配函数编码了核心思想：忽略点作为约束，而所有其他字符必须完全匹配。 主循环只是过滤三个候选者。 

一个常见的错误是忘记区分大小写，尤其是在比较“bob”和“Bob”等输入时。 条件`pc != nc`强制严格匹配。 另一个微妙的点是长度一致性：即使问题表明长度总是正确的，但包括检查可以防止扩展变体中的意外误用。 

## 工作示例

 ### 示例 1

 输入：```
Ali.e
```| 职位| 图案| 爱丽丝| 至今有效|
 | --- | --- | --- | --- |
 | 1 | 一个 | 一个 | 是的 |
 | 2 | 我| 我| 是的 |
 | 3 | 我| 我| 是的 |
 | 4 | 。 | c | 是的 |
 | 5 | 电子| 电子| 是的 |

 只有爱丽丝仍然有效。 

输出：```
Alice
```此跟踪显示单个通配符如何允许完成近乎完美的匹配。 

### 示例 2

 输入：```
bob
```| 候选人 | 步骤结果 |
 | --- | --- |
 | 爱丽丝| 第一个字符不匹配 |
 | 鲍勃 | 由于案例不匹配 |
 | 辛迪 | 第一个字符不匹配 |

 即使是第一个比较步骤，也没有候选人能够幸存。 

输出：```
SOMETHING'S WRONG
```这表明了严格的区分大小写和对冲突的立即拒绝。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(3·n) | O(3·n) | 将三个候选者中的每一个与长度最多为 5 | 的字符串进行逐字符比较。 
| 空间| O(1) | O(1) | 仅使用了一些固定字符串和计数器 |

 这些约束使得这个时间实际上是恒定的。 即使在名称较长的通用版本中，该解决方案在候选数量和字符串长度方面也保持线性。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    import sys

    def matches(pattern, name):
        if len(pattern) != len(name):
            return False
        for pc, nc in zip(pattern, name):
            if pc != '.' and pc != nc:
                return False
        return True

    s = input().strip()
    candidates = ["Alice", "Bob", "Cindy"]

    valid = []
    for name in candidates:
        if matches(s, name):
            valid.append(name)

    if len(valid) == 1:
        return valid[0]
    elif len(valid) > 1:
        return "CAN'T TELL"
    else:
        return "SOMETHING'S WRONG"

# provided samples
assert run("Ali.e") == "Alice"
assert run("bob") == "SOMETHING'S WRONG"

# custom cases
assert run(".....") == "CAN'T TELL"
assert run("A....") == "Alice"
assert run("Cindy") == "Cindy"
assert run("B.b") == "Bob"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | “……”| 不能说 | 所有候选者均通过通配符匹配 |
 | “一个……”| 爱丽丝| 部分前缀约束 |
 | “辛迪”| 辛迪 | 完全匹配 |
 | “B.b”| 鲍勃 | 混合固定和通配符匹配 |

 ## 边缘情况

 像“.....”这样的完全通配符字符串是最重要的非显而易见的情况。 每个候选人都是兼容的，因为每个职位都是不受限制的。 该算法评估所有三个名称并将它们标记为有效，生成 CAN'T TELL。 

像“Zzzzz”这样的严格不匹配情况会显示相反的行为。 每个候选者在第一个字符比较时失败，因此有效列表保持为空并且输出变为“SOMETHING'S WRONG”。 

区分大小写是另一个关键边缘条件。 像“bob”这样的输入一定不能与“Bob”匹配，因为每个字符的比较都是精确的。 该算法通过在不进行标准化的情况下检查相等性来强制执行此操作，从而确保混合大小写输入的正确性。
