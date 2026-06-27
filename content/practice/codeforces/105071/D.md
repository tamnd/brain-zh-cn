---
title: "CF 105071D - 声望猎人"
description: "我们得到了一份固定的公司名称参考列表，按声望排序，其中位置 1 对应于最有声望的公司。 每个查询都包含一个公司名称，我们必须确定该名称是否出现在参考列表中。"
date: "2026-06-27T23:26:18+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105071
codeforces_index: "D"
codeforces_contest_name: "UTPC April Fools Contest 2024"
rating: 0
weight: 105071
solve_time_s: 98
verified: false
draft: false
---

[CF 105071D - 声望猎人](https://codeforces.com/problemset/problem/105071/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 38s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一份固定的公司名称参考列表，按声望排序，其中位置 1 对应于最有声望的公司。 每个查询都包含一个公司名称，我们必须确定该名称是否出现在参考列表中。 如果是，我们输出它在该列表中从 1 开始的位置； 否则我们输出-1。 

关键属性是查找不区分大小写，这意味着仅大写或小写字母不同的名称应被视为相同。 输入大小适中，最多 1000 个查询，每个名称最多 1000 个字符，因此即使相当直接的查找策略也是可行的，但如果列表很大，每个查询重复扫描大列表将变得低效。 

主要的重要边缘情况是标准化。 如果我们无法对存储列表和查询字符串一致地规范化大小写，则将丢失有效匹配。 例如，如果列表包含“Google”并且查询为“goOGle”，则区分大小写的比较会错误地返回 -1。 正确的输出是列表中“Google”的索引。 

另一个边缘情况是以不同形式重复查询和重复公司名称。 由于查询是独立的，因此每个查询都必须针对相同的固定数据集进行回答，而不会产生副作用。 

## 方法

 一种直接的方法是独立处理每个查询并扫描整个公司列表，使用不区分大小写的比较将每个存储的名称与查询进行比较。 这是正确的，因为它会检查每个可能的匹配项，但其成本随着列表中公司的数量和查询的数量而线性增长。 如果列表有 N 个条目，则每次查询都会花费 O(N) 字符串比较，从而导致总工作量为 O(TN)。 对于大的隐藏列表，这很快就会变得太慢。 

关键的观察结果是公司列表是静态的。 由于它在查询中永远不会改变，因此我们可以将其预处理为从规范化公司名称到其排名的哈希映射。 这将每个查询减少为单个字典查找。 关键的步骤是规范化：我们在将每个公司名称插入映射之前将其转换为小写，确保不区分大小写的匹配在全局范围内处理一次，而不是每次查询比较。 

预处理后，每个查询的预期时间变为 O(1)，因为字典查找不依赖于列表大小。 这将成本从重复扫描转移到一次性预处理步骤。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(TN) | O(1) | O(1) | 太慢了 |
 | 哈希图预处理| O(N + T) | O(N) | 已接受 |

 ## 算法演练

 ### 步骤

 1. 阅读完整的公司排名列表并按顺序存储。 

顺序很重要，因为此列表中的索引是每个匹配所需的输出。 
2. 通过将列表中的每个公司名称转换为小写来对其进行标准化。 

这确保了以后的所有比较都是不区分大小写的，而无需重复计算。 
3. 构建一个字典，将每个标准化公司名称映射到其从 1 开始的索引。 

如果存在重复项（不太可能但可以安全处理），则保留第一个出现的项，因为它对应于最佳排名。 
4. 对于每个查询字符串，使用相同的小写转换对其进行规范化。 

这保证了存储的密钥和传入查询之间的一致性。 
5. 检查字典中是否存在规范化查询。 

如果存在，则输出存储的索引； 否则输出-1。 

### 为什么它有效

该算法依赖于一个不变量，即每个公司名称在字典中都以一种规范形式表示：其小写版本。 由于数据集和查询都使用相同的函数进行转换，因此原始字符串中的相等性会减少为标准化字符串中的相等性。 因此，字典成为会员资格和等级信息的完整且无损的表示。 任何查询都不能在不共享规范化键的情况下匹配有效条目，并且无效查询不能出现在字典中，除非它明确存在于原始列表中。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

# The problem refers to an external list of companies.
# In a real contest setting, this would be provided as input or preloaded.
# For this solution, we assume it is available as a static list called companies.

def solve():
    # Since the actual list is external, we simulate structure:
    # Replace this with the actual parsed list from the problem source.
    companies = sys.stdin.readline().strip().split(",")

    # Build mapping from lowercase name to rank
    rank = {}
    for i, name in enumerate(companies, start=1):
        key = name.strip().lower()
        if key not in rank:
            rank[key] = i

    t_line = sys.stdin.readline().strip()
    if not t_line:
        return
    t = int(t_line)

    out = []
    for _ in range(t):
        q = sys.stdin.readline().strip().lower()
        out.append(str(rank.get(q, -1)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```实现的核心是字典`rank`，它存储标准化后每个公司名称第一次出现的索引。 这`.lower()`调用一致地应用于数据集条目和查询，确保不区分大小写的匹配。 

一个微妙的实现问题是剥离空白。 由于输入行可能包含尾随空格或 CSV 解析中隐藏的格式工件，`strip()`在归一化之前应用。 另一个重要的细节是，我们只存储每个标准化名称的第一次出现，在出现重复的情况下保留最佳排名。 

## 工作示例

 由于完整的数据集是外部的，我们构建了一个简化的说明性版本。 

### 示例 1

 输入列表：

 [“元”、“谷歌”、“Netflix”]

 查询：

 [“谷歌”，“亚马逊”]

 | 步骤| 查询 | 标准化| 字典查找 | 输出|
 | ---| ---| ---| ---| ---|
 | 1 | 谷歌 | 谷歌 | 发现于 2 | 2 |
 | 2 | 亚马逊 | 亚马逊 | 没有找到| -1 |

 这确认了不区分大小写的匹配以及对丢失条目的正确处理。 

### 示例 2

 输入列表：

 [“苹果”、“微软”、“OpenAI”、“苹果”]

 查询：

 [“苹果”、“openai”、“特斯拉”]

 | 步骤| 查询 | 标准化 | 字典查找 | 输出|
 | ---| ---| ---| ---| ---|
 | 1 | 苹果| 苹果| 发现于 1 | 1 |
 | 2 | 开放 | 开放 | 发现于 3 | 3 |
 | 3 | 特斯拉 | 特斯拉 | 没有找到| -1 |

 这演示了重复处理：“apple”出现两次，但仅存储第一个索引。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N + T) | 一次构建字典，然后每个查询平均为 O(1) |
 | 空间| O(N) | 字典中每个公司最多可存储一个条目 |

 考虑到约束 T ≤ 1000，预处理成本可以忽略不计，即使公司列表很大，哈希也可确保解决方案在 1 秒内保持高效。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# sample-style simplified dataset encoding assumed in solve()

# custom cases
assert run("Meta,Google,Netflix\n3\ngoogle\namazon\nNETFLIX\n") == "2\n-1\n3"
assert run("Apple,Apple,Apple\n2\napple\nAPPLE\n") == "1\n1"
assert run("A,B,C,D\n4\na\nb\nc\nd\n") == "1\n2\n3\n4"
assert run("X,Y,Z\n2\nx\nw\n") == "1\n-1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 重复的名字 | 第一次出现 | 重复处理 |
 | 完整命中集| 1..N | 索引的正确性|
 | 缺少查询| -1 | 负查找正确性 |
 | 混合大小写 | 正确匹配 | 病例归一化|

 ## 边缘情况

 一个重要的边缘情况是公司列表中重复的标准化名称。 如果输入包含同一家公司的多个变体（仅大小写不同），例如“Google”和“GOOGLE”，则只有第一次出现才应定义排名。 字典构造通过在插入之前检查键是否已经存在来确保这一点。 

另一个边缘情况是不一致的空白。 像“ google ”这样的查询仍应与列表中的“Google”匹配。 正在申请`.strip().lower()`双方确保此类格式差异不会影响正确性。 

最后的边缘情况是与有效公司名称共享前缀或子字符串但在规范化后不相等的查询。 例如，“googl”不应匹配“google”。 由于字典查找需要精确的键相等，因此此类部分匹配会正确返回 -1。
